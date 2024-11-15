import { getAttState } from "@/services/attendanceServices";
import { withErrorHandling } from "@/utils/errorHandler";
import { NextResponse } from "next/server";


/**
 * ユーザーの勤怠状態を受け取るAPI
 */
export const POST = withErrorHandling(async (req: Request) => {
    // リクエストボディからデータを取得
    const { userId } = await req.json();

    // deleteAndInsertshift関数を呼び出し
    const result = await getAttState(userId);

    
    

    // 成功レスポンスを返す
    return NextResponse.json({ message: '操作が成功しました', data: result });
});