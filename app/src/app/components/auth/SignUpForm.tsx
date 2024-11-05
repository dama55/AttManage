'use client';
import { useState } from 'react';

function SignUpForm() {
  const [message, setMessage] = useState<string | null>(null);

  const handleSignUp = async (event: any) => {
    event.preventDefault();
    const displayName = event.target.displayName.value; // 表示名を取得
    const email = event.target.email.value; // メールアドレスを取得
    const password = event.target.password.value;

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, email, password }),
      });
      
      const responseJson = await response.json();

      if (!response.ok) {
        // レスポンスをjson変換してエラーメッセージを取得
        const error = responseJson.error
        
        throw new Error(error || 'Sign-up failed');
      }
      setMessage(responseJson.message);
      console.log('Sign-up successful');
      
      // ここで成功後の処理を追加
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setMessage(errorMessage);
      console.error('Sign-up failed:', errorMessage);
    }
  
  };

  return (
    <form onSubmit={handleSignUp}>
      <input type="text" name="displayName" placeholder="Display Name" required /> {/* 表示名の入力フィールド */}
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </form>
  );
}

export default SignUpForm;