import { supabase } from '@/lib/supabaseClient';
import { getDefaultEventEnd } from '@fullcalendar/core/internal';


interface timeData {
    'id': Number,
    'userId': string,
    'start': string,
    'end': string,
}

interface timeReqData {
    'id': Number,
    'req_num': Number,
    'start': string,
    'end': string,
}



export async function deleteAndInsertshift(
    deleteStart: string,    // 開始日時（ISOフォーマットの文字列）
    deleteEnd: string,      // 終了日時（ISOフォーマットの文字列）
    delData: timeData[], // 削除するデータの配列（IDを含むオブジェクト）
    addData: timeData[] // 追加するデータの配列
) {

    const { data, error } = await supabase
        .rpc('delete_and_insert_shifts', {
            delete_data: delData, 
            insert_data: addData,   
        });

    if (error) {
        console.error("Error in delete_and_insert_shifts:", error);
        throw new Error(error.message);
    }

    return data;
}

export async function deleteAndInsertReqshift(
    deleteStart: string,    // 開始日時（ISOフォーマットの文字列）
    deleteEnd: string,      // 終了日時（ISOフォーマットの文字列）
    delData: timeReqData[], // 削除するデータの配列（IDを含むオブジェクト）
    addData: timeReqData[] // 追加するデータの配列
) {

    const { data, error } = await supabase
        .rpc('delete_and_insert_req_shifts', {
            delete_data: delData, 
            insert_data: addData,   
        });

    if (error) {
        console.error("Error in delete_and_insert_req_shifts:", error);
        throw new Error(error.message);
    }

    return data;
}

export async function getShiftAve(
    userId: string, //探索するユーザーのID
    getStart: string, //開始区間
    getEnd: string, //終わり区間
) {
    console.log("function getShiftAve");
    console.log("userId:", userId);
    console.log("getStart:", getStart);
    console.log("getEnd:", getEnd);
    

    //stringに変換してデータベースに渡す
    const str_getStart = getStart;
    const str_getEnd = getEnd;
    const { data: results, error } = await supabase
        .from('Shift_Ava')
        .select('*')
        .eq('userId', userId)
        .gte('start', str_getStart)
        .lte('end', str_getEnd);

    if (error) {
        throw new Error(error.message);
    }


    return results;
}

export async function getShiftReq(
    getStart: string, //開始区間
    getEnd: string, //終わり区間
) {
    console.log("function getShiftReq");
    console.log("getStart:", getStart);
    console.log("getEnd:", getEnd);
    

    //stringに変換してデータベースに渡す
    const str_getStart = getStart;
    const str_getEnd = getEnd;
    const { data: results, error } = await supabase
        .from('Shift_Req')
        .select('*')
        .gte('start', str_getStart)
        .lte('end', str_getEnd);

    if (error) {
        throw new Error(error.message);
    }
    //結果を返す
    return results;
}
