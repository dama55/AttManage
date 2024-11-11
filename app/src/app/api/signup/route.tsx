import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/**
 * サインアップ処理をまとめたAPI
 * サインインに関してはフロントから直接実行しているが，
 * サインアップに関しては，メールアドレスとパスワードをauth.userテーブルに保存しつつ，
 * ユーザー名をUserテーブルに保存するということをしているため，バックエンドで処理をまとめた．
 * @param request 
 * @returns 
 */
export async function POST(request: Request) {
  const { email, password, displayName } = await request.json();

  try {
    // Supabaseの認証を使ってユーザーをサインアップ
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });

    if (signUpError) {
      return NextResponse.json({ error: 'ユーザー登録に失敗しました: ' + signUpError.message }, { status: 400 });
    }

    const userId = signUpData.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'ユーザーIDの取得に失敗しました' }, { status: 500 });
    }

    // Userテーブルにデータを挿入
    const { data: userData, error: userError } = await supabase
      .from('User')
      .insert([{ userId, name: displayName }]);
    
    if (userError) {
      // Userテーブルへの挿入が失敗した場合、auth.usersのユーザーを削除
      const response = await supabase.auth.admin.deleteUser(userId); // SupabaseのAdmin APIを使用してユーザーを削除

      let errmsg = 'Userテーブルへのデータ保存に失敗しました: '+ userError.message;
      if (response && response.error){
        errmsg = errmsg + ", " + response.error.message;
      }
      console.log(errmsg);
      return NextResponse.json({ error: errmsg }, { status: 500 });
    }

    // 成功した場合のレスポンス
    return NextResponse.json({ message: 'ユーザー登録に成功しました', user: userData });
  } catch (err) {
    return NextResponse.json({ error: 'サインアップ中にエラーが発生しました' }, { status: 500 });
  }
}