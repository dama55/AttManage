'use client';
import { signIn } from "next-auth/react";
import { useState } from 'react';

function SignInForm() {

  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (event: any) => {
    event.preventDefault();
    const name = event.target.name.value;
    const password = event.target.password.value;

    console.log("name: ", name);
    console.log("password: ", password);
    
    // NextAuth.jsを使ってサインイン
    const result = await signIn("credentials", {
      redirect: false,
      name,
      password,
    });

    if (result?.error) {
      // 認証エラーの処理
      setError(error);
      console.error("Sign-in failed:", result.error);
    }
  };

  return (
    <form onSubmit={handleSignIn}>
      <input type="text" name="name" placeholder="Name" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Sign In</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}


export default SignInForm;