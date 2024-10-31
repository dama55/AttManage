import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // 認証情報が必要な場合、ここでセッションを確認するコードを追加

  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}