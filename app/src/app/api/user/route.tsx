import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { error } from 'console';

export async function POST(request: Request) {
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    // SupabaseのUserテーブルからidを使ってユーザーデータを取得
    const { data: userData, error: userError } = await supabase
    .from('User')
    .select('userId, name, role') //カラムの指定
    .eq('userId', id)

    if (userError){
      throw new Error(userError.message);
    }

    if (!userData || userData.length === 0){
      return NextResponse.json({error: 'User not found'}, {status: 404});
    }
    
    // idに対して複数検知されたらやばい
    if (userData.length > 1){
      return NextResponse.json({error: 'Multiple users found for the given ID.'}, {status: 200});
    }

    return NextResponse.json(userData[0]);//userDataは配列で返される
  }catch(err:unknown){
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    } else {
      // `err` が `Error` 型でない場合のフォールバック
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  }

}