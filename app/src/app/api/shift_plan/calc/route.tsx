import { NextResponse } from 'next/server';
import { deleteAndInsertshift, getMultiShiftAve, getShiftReq } from '@/modules/shiftModules';
import { withErrorHandling } from '@/utils/errorHandler';
import { makeShiftDelAndAdd } from '@/services/makeShiftDelAndAdd';
import { getUsersByRole } from '@/modules/userModules';
import { makeShiftPlan } from '@/services/makeShiftPlan';

/* 
    delData, addData = {
        'id': INTEGER,
        'userId': UUID,
        'start': TIMESTAMP,
        'end': TIMESTAMP
    }
*/

interface UserData{
    userId: string,
    role: string,
    name: string,
}

export const POST = withErrorHandling(async (req: Request) => {
    // リクエストボディからデータを取得
    const { calcStart, calcEnd, roles } = await req.json();

    // roleに該当するユーザーを取得
    const userData =  await getUsersByRole(roles);
    const userIds = userData.map((userobj: UserData) => {
        return userobj.userId;
    });

    // ユーザーに該当するシフト希望を取得
    const userShifts = await getMultiShiftAve(userIds, calcStart, calcEnd);
    
    // 期間に該当するシフト要求を取得
    const reqShifts = await getShiftReq(calcStart, calcEnd);

    // ユーザーシフト，シフト要求から割り当て結果を取得
    const { sortedShifts, noShift } = makeShiftPlan(reqShifts, userShifts);

    

    // データを返す
    return NextResponse.json({ message: '操作が成功しました', result: { sortedShifts, noShift } });
});