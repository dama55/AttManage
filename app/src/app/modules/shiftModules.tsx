import { supabase } from '@/lib/supabaseClient';
import { getDefaultEventEnd } from '@fullcalendar/core/internal';
import { withErrorHandling } from '@/utils/errorHandler';
import { convertToISOFormat } from '@/utils/stringUtils';


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

/* 複数人のユーザーのシフト情報を一度に取り出し */
export const getMultiShiftAve = withErrorHandling(async (
    userIds: string[], 
    getStart: string, 
    getEnd: string
) => {
    console.log("function getShiftAve");
    console.log("userId:", userIds);
    console.log("getStart:", getStart);
    console.log("getEnd:", getEnd);

    // stringに変換してデータベースに渡す
    const str_getStart = getStart;
    const str_getEnd = getEnd;
    const { data: results, error } = await supabase
        .from('Shift_Ava')
        .select('*')
        .in('userId', userIds)
        .gte('start', str_getStart)
        .lte('end', str_getEnd);

    if (error) {
        throw new Error(error.message);
    }

    // 日時データの変換
    const convertedResults = results.map(item => ({
        ...item,
        start: convertToISOFormat(item.start),
        end: convertToISOFormat(item.end)
    }));

    return convertedResults;
});

/* 店側の要求シフト */
export const getShiftReq = withErrorHandling(async (
    getStart: string, //開始区間
    getEnd: string //終わり区間
) => {
    console.log("function getShiftReq");
    console.log("getStart:", getStart);
    console.log("getEnd:", getEnd);

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

    if(results.length < 1){
        return []; //要素数が0ならからの配列を返す．
    }

    // 日時データの変換
    const convertedResults = results.map(item => ({
        ...item,
        start: convertToISOFormat(item.start),
        end: convertToISOFormat(item.end)
    }));

    
    return convertedResults;
});

/* 確定したシフト情報を返す */
export const getShiftAssi = withErrorHandling(async (
    getStart: string, //開始区間
    getEnd: string //終わり区間
) => {
    console.log("function getShiftAssi");
    console.log("getStart:", getStart);
    console.log("getEnd:", getEnd);
    
    // stringに変換してデータベースに渡す
    const str_getStart = getStart;
    const str_getEnd = getEnd;

    const { data: results, error } = await supabase
        .from('Shift_Assi')
        .select('*')
        .gte('start', str_getStart)
        .lte('end', str_getEnd);

    if (error) {
        throw new Error(error.message);
    }

    return results;
});

export async function deleteAndInsertAssishift(
    deleteStart: string,    // 開始日時（ISOフォーマットの文字列）
    deleteEnd: string,      // 終了日時（ISOフォーマットの文字列）
    delData: timeData[], // 削除するデータの配列（IDを含むオブジェクト）
    addData: timeData[] // 追加するデータの配列
) {

    const { data, error } = await supabase
        .rpc('delete_and_insert_assi_shifts', {
            delete_data: delData, 
            insert_data: addData,   
        });

    if (error) {
        console.error("Error in delete_and_insert_shifts:", error);
        throw new Error(error.message);
    }

    return data;
}