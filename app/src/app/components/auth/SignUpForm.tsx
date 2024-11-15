'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { emitKeypressEvents } from 'readline';
import styles from '@/components/auth/SignInForm.module.css';
import Link from 'next/link';

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
    <>
    <form className={styles.container} onSubmit={handleSignUp}>
      <input className={styles.Signinput} type="text" name="displayName" placeholder="Display Name" required /> {/* 表示名の入力フィールド */}
      <input className={styles.Signinput} type="email" name="email" placeholder="Email" required />
      <input className={styles.Signinput} type="password" name="password" placeholder="Password" required />
      <button className={styles.custom_button} type="submit">Sign Up</button>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <Link href='/pages/signin'>サインインページ</Link>
    </form>
    </>
  );
}

export default SignUpForm;