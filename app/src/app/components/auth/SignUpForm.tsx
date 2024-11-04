'use client';
import { useState } from 'react';

function SignUpForm() {
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (event: any) => {
    event.preventDefault();
    const displayName = event.target.displayName.value; // 表示名を取得
    const email = event.target.email.value; // メールアドレスを取得
    const password = event.target.password.value;

    try {
      // サインアップ処理（APIリクエストを送信するなど）
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, email, password }), // displayNameも送信
      });

      // レスポンスをjson変換
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Sign-up failed');
        throw new Error('Sign-up failed', result.error);
      }

      // サインアップ成功後の処理（例えば、サインインページへのリダイレクトなど）
      console.log('Sign-up successful');
    } catch (err: unknown) {
      if (err instanceof Error) {
        // エラーハンドリング
        setError(err.message);
        console.error('Sign-up failed:'+error, err);
      }
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <input type="text" name="displayName" placeholder="Display Name" required /> {/* 表示名の入力フィールド */}
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default SignUpForm;