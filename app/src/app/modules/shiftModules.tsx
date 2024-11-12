import { supabase } from '@/lib/supabaseClient';
import { getDefaultEventEnd } from '@fullcalendar/core/internal';


interface timeData {
    'id': Number,
    'userId': string,
    'start': Date,
    'end': Date,
}

export async function deleteAndInsertshift(
    deleteStart: string,    // 開始日時（ISOフォーマットの文字列）
    deleteEnd: string,      // 終了日時（ISOフォーマットの文字列）
    delData: timeData[], // 削除するデータの配列（IDを含むオブジェクト）
    addData: timeData[] // 追加するデータの配列
) {
    // Date型をISO文字列にしてフロントに返す．
    const converted_delData = delData.map(data => ({
        ...data,
        start: data.start.toISOString(), // ISO文字列をDateオブジェクトに変換
        end: data.end.toISOString()       // 同様に変換
    }));

    const converted_addData = addData.map(data => ({
        ...data,
        start: data.start.toISOString(), // ISO文字列をDateオブジェクトに変換
        end: data.end.toISOString()       // 同様に変換
    }));

    const { data, error } = await supabase
        .rpc('delete_and_insert_shifts', {
            delete_data: converted_delData, 
            insert_data: converted_addData,   
        });

    if (error) {
        console.error("Error in delete_and_insert_shifts:", error);
        throw new Error(error.message);
    }

    return data;
}

export async function getShiftAve(
    userId: string, //探索するユーザーのID
    getStart: Date, //開始区間
    getEnd: Date, //終わり区間
) {
    //stringに変換してデータベースに渡す
    const str_getStart = getStart.toISOString();
    const str_getEnd = getEnd.toISOString();
    const { data: results, error } = await supabase
        .from('Shift_Ava')
        .select('*')
        .eq('userId', userId)
        .gte('start', str_getStart)
        .lte('end', str_getEnd);

    if (error) {
        throw new Error(error.message);
    }

    // ISO文字列をDate型にしてフロントに返す．
    const converted_results = results.map(data => ({
        ...data,
        start: new Date(data.start), // ISO文字列をDateオブジェクトに変換
        end: new Date(data.end)       // 同様に変換
    }));

    return converted_results;
}
