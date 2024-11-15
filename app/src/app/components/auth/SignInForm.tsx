'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/auth/useAuth';
import styles from '@/components/auth/SignInForm.module.css';
import ControlButton from '@/components/ControlButton';
import Link from 'next/link';

function SignInForm() {
  const { message, signIn } = useAuth();

  const handleSignIn = async (event: any) => {
    event.preventDefault();
    const email = event.target.email.value; // メールアドレスを取得
    const password = event.target.password.value;//パスワードを取得

    signIn(email, password);
  }

  return (
    <>
      <form className={styles.container} onSubmit={handleSignIn}>
        <input className={styles.Signinput} type="email" name="email" placeholder="Email" required />
        <input className={styles.Signinput} type="password" name="password" placeholder="Password" required />
        <button className={styles.custom_button} type="submit">Sign In</button>
        {message && <p style={{ color: 'red' }}>{message}</p>}
        <Link href='/pages/signup'>サインアップページ</Link>
      </form>

    </>
  );
}

export default SignInForm;