import { NextResponse } from 'next/server';
import { deleteAndInsertReqshift } from '@/modules/shiftModules';
import { withErrorHandling } from '@/utils/errorHandler';
import { makeReqShiftDelAndAdd } from '@/services/makeReqShiftDelAndAdd';

/* 
    delData, addData = {
        'id': INTEGER,
        'req_num': INTEGER,
        'start': TIMESTAMP,
        'end': TIMESTAMP
    }
*/
export const POST = withErrorHandling(async (req: Request) => {
    // リクエストボディからデータを取得
    const { deleteStart, deleteEnd, preData, newData } = await req.json();

    // シフト更新前後の要素を見て，どのシフトが追加され，どのシフトが削除されたかのかを確認．
    const {delData, addData} = makeReqShiftDelAndAdd(preData, newData);

    // deleteAndInsertshift関数を呼び出し
    const result = await deleteAndInsertReqshift(deleteStart, deleteEnd, delData, addData);

    // 成功レスポンスを返す
    return NextResponse.json({ message: '操作が成功しました', result });
});