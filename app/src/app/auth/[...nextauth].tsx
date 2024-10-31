// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: { //signIn関数に与える属性の定義
        name: { label: "Name", type: "text", placeholder: "John Doe" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {//認証の処理
        const { name, password } = credentials;

        // ユーザーの認証
        const user = await prisma.user.findUnique({
          where: { name }
        });

        if (user && await bcrypt.compare(password, user.password)) {
          return { id: user.id, name: user.name };
        } else {
          // 新規登録の場合
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = await prisma.user.create({
            data: {
              name,
              password: hashedPassword,
            },
          });
          return { id: newUser.id, name: newUser.name };
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin', // サインインページのカスタマイズ
  },
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // ユーザーIDをトークンに追加
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id; // セッションにユーザーIDを追加
      return session;
    }
  }
});