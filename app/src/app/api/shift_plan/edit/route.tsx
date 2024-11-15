import { NextResponse } from 'next/server';
import { deleteAndInsertAssishift } from '@/modules/shiftModules';
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

/* 割り当て済みのシフトを管理 */
export const POST = withErrorHandling(async (req: Request) => {
    // リクエストボディからデータを取得
    const { deleteStart, deleteEnd, preData, newData } = await req.json();

    // シフト更新前後の要素を見て，どのシフトが追加され，どのシフトが削除されたかのかを確認．
    const {delData, addData} = makeShiftDelAndAdd(preData, newData);

    // deleteAndInsertAssishift関数を呼び出し
    const result = await deleteAndInsertAssishift(deleteStart, deleteEnd, delData, addData);

    // 成功レスポンスを返す
    return NextResponse.json({ message: '操作が成功しました', result });
});