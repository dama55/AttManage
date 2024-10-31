'use client';
import { signIn } from "next-auth/react";

function SignInForm() {
  const handleSignIn = async (event: any) => {
    event.preventDefault();
    const name = event.target.name.value;
    const password = event.target.password.value;
    
    // NextAuth.jsを使ってサインイン
    const result = await signIn("credentials", {
      redirect: false,
      credentials: { name, password },
    });

    if (result?.error) {
      // 認証エラーの処理
      console.error("Sign-in failed:", result.error);
    }
  };

  return (
    <form onSubmit={handleSignIn}>
      <input type="text" name="name" placeholder="Name" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Sign In</button>
    </form>
  );
}


export default SignInForm;