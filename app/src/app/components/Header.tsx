'use client';
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabaseClient'; // Supabaseクライアントをインポート
import '@/globals.css'; // グローバルCSSのインポート
import styles from './Header.module.css';
import { useUserContext, UserContextProvider } from "@/contexts/UserContext";
import { useSessionContext } from "@/contexts/SessionContext";


export function Header() {
    const { role, name } = useUserContext();
    const { session, handleSignIn, handleSignOut} = useSessionContext();

    console.log("role: ", role);
    console.log("name: ", name);

    return (
        <div className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.loginSection}>
                    {/* ログイン状態に基づいてボタンを切り替える */}
                    <span className={styles.greetingMessage}>
                        {name ? `${name}さん，こんにちは！` : ""}
                    </span>
                    {session ? (
                        <button className={styles.logoutButton} onClick={handleSignOut}>サインアウト</button>
                    ) : (
                        <button className={styles.loginButton} onClick={handleSignIn}>サインイン</button>
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


export default function HeaderWrapper(){
    return (
        <UserContextProvider>
            <Header/>
        </UserContextProvider>
    )
}
