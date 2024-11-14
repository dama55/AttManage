import { NextResponse } from 'next/server';
import { getShiftAve } from '@/modules/shiftModules';
import { withErrorHandling } from '@/utils/errorHandler';

/* 
    delData, addData = {
        'id': INTEGER,
        'userId': UUID,
        'start': TIMESTAMP,
        'end': TIMESTAMP
    }
*/

/**
 * データベースから特定のuserIdに該当する従業員の
 * 特定の期間のシフトを全て持ってくる関数
 */
export const POST = withErrorHandling(async (req: Request) => {
    // リクエストボディからデータを取得
    const { userId, getStart, getEnd } = await req.json();

    // deleteAndInsertshift関数を呼び出し
    const result = await getShiftAve(userId, getStart, getEnd);

    
    

    // 成功レスポンスを返す
    return NextResponse.json({ message: '操作が成功しました', data: result });
});