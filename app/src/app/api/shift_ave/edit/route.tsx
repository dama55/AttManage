import { NextResponse } from 'next/server';
import { deleteAndInsertshift } from '@/modules/shiftModules';
import { withErrorHandling } from '@/utils/errorHandler';
import { makeShiftDelAndAdd } from '@/services/makeShiftDelAndAdd';

/* 
    delData, addData = {
        'id': INTEGER,
        'userId': UUID,
        'start': TIMESTAMP,
        'end': TIMESTAMP
    }
*/
export const POST = withErrorHandling(async (req: Request) => {
    // リクエストボディからデータを取得
    const { deleteStart, deleteEnd, preData, newData } = await req.json();

    // シフト更新前後の要素を見て，どのシフトが追加され，どのシフトが削除されたかのかを確認．
    const {delData, addData} = makeShiftDelAndAdd(preData, newData);

    // deleteAndInsertshift関数を呼び出し
    const result = await deleteAndInsertshift(deleteStart, deleteEnd, delData, addData);

    // 成功レスポンスを返す
    return NextResponse.json({ message: '操作が成功しました', result });
});