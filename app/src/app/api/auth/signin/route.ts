import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { name, password } = await request.json();

  // ユーザーを検索
  const user = await prisma.user.findFirst({ //テーブル名を小文字にしたものuser
    where: { name },
  });

  // パスワードの照合
  if (user && await bcrypt.compare(password, user.password)) {
    // 成功した場合、ユーザー情報を返す
    return NextResponse.json({ id: user.id, name: user.name });
  }

  // 認証失敗
  return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
}