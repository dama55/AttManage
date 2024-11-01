'use client';
import { useState } from 'react';

function SignUpForm() {
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (event: any) => {
    event.preventDefault();
    const name = event.target.name.value;
    const password = event.target.password.value;

    try {
      // サインアップ処理（APIリクエストを送信するなど）
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });

      if (!response.ok) {
        throw new Error('Sign-up failed');
      }

      // サインアップ成功後の処理（例えば、サインインページへのリダイレクトなど）
      console.log('Sign-up successful');
    } catch (err: unknown) {

        if (err instanceof Error){
            // エラーハンドリング
            setError(err.message);
            console.error('Sign-up failed:', err);
        }
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <input type="text" name="name" placeholder="Name" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default SignUpForm;