import { NextResponse } from 'next/server';
import { deleteAndInsertshift } from '@/modules/shiftModules';
import { withErrorHandling } from '@/utils/errorHandler';

export const POST = withErrorHandling(async (req: Request) => {
    // リクエストボディからデータを取得
    const { deleteStart, deleteEnd, delData, addData } = await req.json();

    // deleteAndInsertshift関数を呼び出し
    const result = await deleteAndInsertshift(deleteStart, deleteEnd, delData, addData);

    // 成功レスポンスを返す
    return NextResponse.json({ message: '操作が成功しました', result });
});