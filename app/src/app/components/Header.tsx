'use client';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import '@/globals.css'; // グローバルCSSのインポート
import styles from './Header.module.css';

export default function Header() {
    const { data: session } = useSession();
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);

    // ロールを取得するためのAPI呼び出し
    useEffect(() => {
        const fetchRole = async () => {
            if (session?.user.id) {
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

    return (
        <div className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.loginSection}>
                    {/* ログイン状態に基づいてボタンを切り替える */}
                    <span className={styles.greetingMessage}>
                        {session ? `${session.user.name}さん，こんにちは！` : ""}
                    </span>
                    {session ? (
                        <button className={styles.logoutButton} onClick={() => signOut()}>ログアウト</button>
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
