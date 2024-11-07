'use client';
// UserContext現在のユーザー情報を保存するコンテキスト
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session } from '@supabase/supabase-js'; // Supabaseの型をインポート
import { useSessionContext } from "@/contexts/SessionContext";

interface UserContextType {
    name: string | null;
    role: string | null;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserContextProvider({ children }: { children: ReactNode }) {
    const { session } = useSessionContext();
    const [name, setName] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (session?.user) {
                try {
                    const response = await fetch('/api/auth/user', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: session.user.id }),
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setName(data.name);
                        setRole(data.role);
                    } else {
                        console.error("Failed to fetch user details");
                    }
                } catch (error) {
                    console.error("Error fetching user details:", error);
                }
            }
        };

        fetchUserDetails();
    }, [session]);


    return (
        <UserContext.Provider value={{ name, role }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext(){
    // プロバイダーが返した情報を取得してみる
    const context = useContext(UserContext);
    //プロバイダーは何らかの値を渡している必要があり，それがない場合にエラーが発生
    if (!context){
        throw new Error("useUserContext must be used within a UserContextProvider")
    }
    return context;
}