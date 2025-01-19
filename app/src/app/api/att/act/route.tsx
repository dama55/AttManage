import { getAttState } from "@/services/attendanceServices";
import { withErrorHandling } from "@/utils/errorHandler";
import { NextResponse } from "next/server";
import { ActAtt } from "@/services/attendanceServices";


/**
 * ユーザーの勤怠行動を実行するAPI
 */
export const POST = withErrorHandling(async (req: Request) => {
    // リクエストボディからデータを取得
    const { userId, act, time } = await req.json();

    // deleteAndInsertshift関数を呼び出し
    const result = await ActAtt(userId, act, time);

    
    

    // 成功レスポンスを返す
    return NextResponse.json({ message: '操作が成功しました', data: result });
});