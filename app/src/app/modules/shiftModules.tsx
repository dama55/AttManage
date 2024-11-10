import { supabase } from '@/lib/supabaseClient';
import { getDefaultEventEnd } from '@fullcalendar/core/internal';

export async function deleteAndInsertshift(
    deleteStart: string,    // 開始日時（ISOフォーマットの文字列）
    deleteEnd: string,      // 終了日時（ISOフォーマットの文字列）
    delData: { id: number }[], // 削除するデータの配列（IDを含むオブジェクト）
    addData: { userId: number, start: string, end: string }[] // 追加するデータの配列
) {
    const { data, error } = await supabase// data, errorというプロパティを個別に受け取る
        .rpc('delete_and_insert_shifts', {
            delete_start: deleteStart,
            delete_end: deleteEnd,
            new_shifts: addData,
    });

    if (error) {
        throw new Error(error.message);
    }

    return
}