// src/app/pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findFirst({
          where: { name: credentials?.name },
        });

        if (user && credentials?.password) {
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (isValid) {
            return { id: user.id.toString(), name: user.name };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.sub as string, // idをstringとして保証し追加
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id.toString();
        token.name = user.name;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});