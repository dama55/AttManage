import { NextResponse } from 'next/server';
import { getShiftAssi } from '@/modules/shiftModules';
import { withErrorHandling } from '@/utils/errorHandler';
import { getShiftReq } from '@/modules/shiftModules';
import { makeAssignedShiftForView } from '@/services/makeShiftPlan';
import { getAllUsers } from '@/modules/userModules';

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

    // リクエストボディからデータを取得
    const { getStart, getEnd } = await req.json();

    // ユーザーごとの割り当て済みシフトを保持する
    const avaShifts = await getShiftAssi(getStart, getEnd);
    // 店の要求シフトを取り出す．
    const reqShifts = await getShiftReq(getStart, getEnd);

    // ユーザー情報の取得
    const UserData = await getAllUsers();
    const userNamesObj = UserData.reduce((acc: { [key: string]: string }, user) => {
        acc[user.userId] = user.name;
        return acc;
    }, {} as { [key: string]: string });

    console.log("avaShifts:", avaShifts);
    console.log("reqShifts:", reqShifts);

    const { assiShifts } = makeAssignedShiftForView(avaShifts, reqShifts, userNamesObj);

    // 成功レスポンスを返す
    return NextResponse.json({ message: '操作が成功しました', result: { avaShifts, assiShifts } });
});