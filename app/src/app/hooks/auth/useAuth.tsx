// hooks/useAuth.ts
'use client';
import { supabase } from '@/lib/supabaseClient';
import { useAsyncWithErrorHandling } from '@/hooks/useAsyncWithErrorHandling'

interface AuthResponse {
  message: string;
  error?: string;
}

export function useAuth() {
  const { result: message, error, loading, executeAsyncFunction } = useAsyncWithErrorHandling<string>();

  // サインアップ関数
  const signUp = (displayName: string, email: string, password: string) =>
    executeAsyncFunction(async () => {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, email, password }),
      });

      const responseJson: AuthResponse = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.error || 'Sign-up failed');
      }
      return responseJson.message;
    });

  // サインイン関数
  const signIn = (email: string, password: string) =>
    executeAsyncFunction(async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }
      console.log("Sign-in successful:", data);
      return "Sign-in successful";
    });

  return { message, error, loading, signUp, signIn };
}
