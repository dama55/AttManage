'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { emitKeypressEvents } from 'readline';

function SignUpForm() {
  const {message, signUp} = useAuth();
  // const [message, setMessage] = useState<string | null>(null);

  const handleSignUp = async (event: any) => {
    event.preventDefault();
    const displayName = event.target.displayName.value; // 表示名を取得
    const email = event.target.email.value; // メールアドレスを取得
    const password = event.target.password.value;

    signUp(displayName, email, password);//カスタムフックを呼び出し
  
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