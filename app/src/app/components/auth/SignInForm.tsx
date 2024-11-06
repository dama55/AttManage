'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/auth/useAuth';

function SignInForm() {
  const { message, signIn } = useAuth();

  const handleSignIn = async (event: any) => {
    event.preventDefault();
    const email = event.target.email.value; // メールアドレスを取得
    const password = event.target.password.value;//パスワードを取得

    signIn(email, password);
  }
    
  return (
    <form onSubmit={handleSignIn}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Sign In</button>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </form>
  );
}

export default SignInForm;