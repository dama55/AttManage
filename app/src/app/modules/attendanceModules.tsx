import { withErrorHandling } from "@/utils/errorHandler";
import { supabase } from "@/lib/supabaseClient";

/* 最近の出勤情報を取り出す関数 */
export const getLatestAtt = withErrorHandling(async (
    userId: string, //ユーザーIDで検索
) => {
    

    const { data: results, error } = await supabase
        .from('Attendance')
        .select('*')
        .eq('userId', userId) //ユーザーIDでフィルタリング
        .order('start', { ascending: true})
        .limit(1);

    if (error) {
        throw new Error(error.message);
    }

    return results && results.length > 0 ? results[0] : null;
});


/* 最新の休憩情報を取り出す関数 */
export const getLatestRest = withErrorHandling(async (
    userId: string,
)=> {
    const { data: results, error } = await supabase
        .from('Rest')
        .select('*')
        .eq('userId', userId) //ユーザーIDでフィルタリング
        .order('start', { ascending: true})
        .limit(1);

    if (error) {
        throw new Error(error.message);
    }

    return results && results.length > 0 ? results[0] : null;
});

export const editLatestAttEnd = withErrorHandling(async(
    userId: string,
    time: string,
)=> {

    const att = await getLatestAtt(userId);

    // 取得できなかった場合
    if (!att) {
        throw new Error("打刻時間が取得できませんでした．状態を確認して下さい");
    }

    // 最新の出勤情報のID
    const attendanceId = att.id;

    const newData = {...att, end: time};//終了時間の修正

    // 最新の出勤情報を更新
    const { data: updatedAtt, error: updateError } = await supabase
        .from('Attendance')
        .update(newData) // 更新するデータを指定
        .eq('id', attendanceId); // 最新の出勤情報のIDで特定

    if (updateError) {
        throw new Error("データ編集時にエラー発生: "+updateError.message);
    }

    return updatedAtt ? updatedAtt[0] : null;
});

/* 最新の休憩時間のendを編集 */
export const editLatestRestEnd = withErrorHandling(async(
    userId: string,
    time: string,
)=> {

    const rest = await getLatestRest(userId);

    // 取得できなかった場合
    if (!rest) {
        throw new Error("休憩時間が取得できませんでした．状態を確認して下さい");
    }

    // 最新の出勤情報のID
    const restId = rest.id;

    const newData = {...rest, end: time};//終了時間の修正

    // 最新の出勤情報を更新
    const { data: updatedAtt, error: updateError } = await supabase
        .from('Rest')
        .update(newData) // 更新するデータを指定
        .eq('id', restId); // 最新の出勤情報のIDで特定

    if (updateError) {
        throw new Error("データ編集時にエラー発生: "+updateError.message);
    }

    return updatedAtt ? updatedAtt[0] : null;
});

/* 出勤データを追加する関数 */
export const addToAtt = async (
    userId: string, 
    time: string
) => {
    const newData = {
        userId,
        start: time,
        end: null // 初期状態で終了時間はnull
    };

    const { data, error } = await supabase
        .from('Attendance')
        .insert(newData)
        .select();

    if (error) {
        throw new Error("出勤データ登録時にエラー発生: " + error.message);
    }

    return data ? data[0] : null;
};

/* 休憩データを追加する関数 */
export const addToRest = async (userId: string, attId: string, time: string) => {
    const newData = {
        userId,
        attId, // 出勤データのIDを関連付け
        start: time,
        end: null // 初期状態で終了時間はnull
    };

    const { data, error } = await supabase
        .from('Rest')
        .insert(newData)
        .select();

    if (error) {
        throw new Error("休憩データ登録時にエラー発生: " + error.message);
    }

    return data ? data[0] : null;
};