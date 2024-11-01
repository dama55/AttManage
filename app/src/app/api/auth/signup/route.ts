import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { name, password } = await request.json();

  const existingUser = await prisma.user.findFirst({
    where: {name},
  })

  if (existingUser){
    return NextResponse.json({error: 'ユーザーは既に存在します' }, { status: 409 })
  }

  // パスワードをハッシュ化
  const hashedPassword = await bcrypt.hash(password, 10);

  // ユーザーを作成
  const user = await prisma.user.create({
    data: {
      name,
      password: hashedPassword,
    },
  });

  return NextResponse.json(user);
}