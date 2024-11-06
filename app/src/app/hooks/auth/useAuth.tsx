'use client';
// hooks/useAuth.ts
//サインアップは頻繁に使わないので，カスタムフックにまとめる
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface AuthResponse {
    message: string;
    error?: string;
}

export function useAuth() {
    const [message, setMessage] = useState<string | null>(null);

    //一旦バックエンドを介してsupabaseを呼び出す
    const signUp = async (displayName: string, email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ displayName, email, password }),
            });

            const responseJson: AuthResponse = await response.json();

            if (!response.ok) {
                throw new Error(responseJson.error || 'Sign-up failed');
            }
            setMessage(responseJson.message);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setMessage(errorMessage);
        }
    };

    //フロントから直接supabase APIを呼び出し
    const signIn = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw new Error(error.message);
            }
            setMessage("Sign-in successful");
            console.log("Sign-in successful:", data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setMessage(errorMessage);
            console.error("Sign-in failed:", errorMessage);
        }
    };



    return { message, signUp, signIn };
}