'use client';
//src/app/context/session.tsx
//セッション用のコンテキスト

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js'; // Supabaseの型をインポート
import { supabase } from '@/lib/supabaseClient'; // Supabaseクライアントをインポート
import { useFormState } from 'react-dom';
import { useRouter } from "next/navigation";


const SessionContext = createContext<SessionContextType | null>(null);

//セッションコンテキストの型定義
interface SessionContextType {
    session: Session | null;
    handleSignIn: ()=> Promise<void>;
    handleSignOut: ()=> Promise<void>;
}

interface SessionContextProviderProps {
    children: ReactNode;
}

interface SessionContextProviderProps {
    children: ReactNode;
}

export function SessionContextProvider({ children }: SessionContextProviderProps) {
    // セッション情報の取得
    const [session, setSession] = useState<any>(null);
    const router = useRouter();


    //セッションの取得
    // Supabaseセッションを取得
    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
        };

        getSession();

        // セッションの変更をリッスン
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
        });

        // クリーンアップ
        // useEffect内で関数をreturnすると，このコンポーネントがアンマウント（削除される）場合にこの関数が実行される
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);
    
    //サインインページに飛ばす処理
    const handleSignIn = async () => {
        router.push("/pages/signin");
    };

    //サインアウトをする処理
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/pages/signin");
    };

    
    return (
        <SessionContext.Provider value={{ session, handleSignIn, handleSignOut }}>
            {children}
        </SessionContext.Provider>
    )
}



export function useSessionContext() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSessionContext must be used within a SessionContextProvider");
    }
    return context;
}