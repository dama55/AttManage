import { NextResponse } from 'next/server';
import { getShiftReq } from '@/modules/shiftModules';
import { withErrorHandling } from '@/utils/errorHandler';

/* 
    delData, addData = {
        'id': INTEGER,
        'req_num': INTEGER,
        'start': TIMESTAMP,
        'end': TIMESTAMP
    }
*/

/**
 * データベースから特定のuserIdに該当する従業員の
 * 特定の期間のシフトを全て持ってくる関数
 */
export const POST = withErrorHandling(async (req: Request) => {

    console.log("I'm here and result is as follows");

    // リクエストボディからデータを取得
    const { getStart, getEnd } = await req.json();

    // deleteAndInsertshift関数を呼び出し
    const result = await getShiftReq(getStart, getEnd);

    
    

    // 成功レスポンスを返す
    return NextResponse.json({ message: '操作が成功しました', data: result });
});