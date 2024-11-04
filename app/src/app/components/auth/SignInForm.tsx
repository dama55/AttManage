'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

function SignInForm() {
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (event: any) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    console.log("email: ", email);
    console.log("password: ", password);

    // Supabaseを使ってサインイン
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // 認証エラーの処理
      setError(error.message);
      console.error("Sign-in failed:", error.message);
    } else {
      // 認証成功後の処理
      console.log("Sign-in successful:", data);
    }
  };

  return (
    <form onSubmit={handleSignIn}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Sign In</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default SignInForm;