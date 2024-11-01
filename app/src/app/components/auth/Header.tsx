'use client';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import '@/globals.css'; // グローバルCSSのインポート
import styles from './Header.module.css';

export default function Header() {
    const { data: session } = useSession();
    const router = useRouter();

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
                    {/* <h2 className={styles.roleTitle} style={{ display: session ? "block" : "none" }}>
            {session?.user.role || ""}
          </h2> */}
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
