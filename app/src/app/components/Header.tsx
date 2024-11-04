'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabaseClient'; // Supabaseクライアントをインポート
import '@/globals.css'; // グローバルCSSのインポート
import styles from './Header.module.css';

export default function Header() {
    const [session, setSession] = useState<any>(null);
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);

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
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // ロールを取得するためのAPI呼び出し
    useEffect(() => {
        const fetchRole = async () => {
            if (session?.user) {
                try {
                    const response = await fetch(`/api/auth/user?id=${session.user.id}`);
                    if (response.ok) {
                        const data = await response.json();
                        setRole(data.role);
                    } else {
                        console.error("Failed to fetch role");
                    }
                } catch (error) {
                    console.error("Error fetching role:", error);
                }
            }
        };

        fetchRole();
    }, [session]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/pages/signin");
    };

    return (
        <div className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.loginSection}>
                    {/* ログイン状態に基づいてボタンを切り替える */}
                    <span className={styles.greetingMessage}>
                        {session ? `${session.user.email}さん，こんにちは！` : ""}
                    </span>
                    {session ? (
                        <button className={styles.logoutButton} onClick={handleSignOut}>ログアウト</button>
                    ) : (
                        <button className={styles.loginButton} onClick={() => router.push("/pages/signin")}>ログイン</button>
                    )}
                </div>
                <div className={styles.roleTitle}>
                    {/* ロールを表示 */}
                    {role && <h2 className={styles.roleTitle}>{role}</h2>}
                </div>
                <div className={styles.divIcon}>
                    {/* 通知アイコン（未読チェックはカスタム関数で実装） */}
                    <span className="material-symbols-outlined">mail</span>
                </div>
            </div>
            <hr className={styles.headerHr} />
        </div>
    );
}
