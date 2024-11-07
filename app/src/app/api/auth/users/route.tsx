import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { error } from 'console';
import { getAllUsers } from '@/services/userService';

export async function GET(request: Request) {

  try {
    // supabaseのUserテーブルから全てのユーザーのカラムを取得

    const userData = await getAllUsers(); // サービス層からデータを取得

    if (!userData || userData.length === 0){
      return NextResponse.json({error: 'User not found'}, {status: 404});
    }

    return NextResponse.json(userData);//userDataは配列で返される
  }catch(err:unknown){
    if (err instanceof Error){
      return NextResponse.json({ error: err.message }, { status: 500 });
    } else {
      // `err` が `Error` 型でない場合のフォールバック
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  }
  
}