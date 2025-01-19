// components/Header.tsx

'use client';
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabaseClient'; // Supabaseクライアントをインポート
import '@/globals.css'; // グローバルCSSのインポート
import styles from './Header.module.css';
import { useUserContext, UserContextProvider } from "@/contexts/UserContext";
import { useSessionContext } from "@/contexts/SessionContext";
import Breadcrumbs from './Breadcrumbs';
import '@/components/Header.css';
import { IoMailUnreadSharp, IoMailSharp } from "react-icons/io5";
import { RiMoneyCnyCircleFill } from "react-icons/ri";
import { GrPlan } from "react-icons/gr";
import { MdWorkHistory } from "react-icons/md"
import { FaSignOutAlt, FaSignInAlt } from "react-icons/fa";

export function Header() {
    const { role, name } = useUserContext();
    const { session, handleSignIn, handleSignOut } = useSessionContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mailOn, setMailOn] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'; // メニューが開いているときにスクロールを無効化
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isMenuOpen]);

    return (
        <>
            <div className={styles.header}>

                <div className={styles.headerContent}>
                    <div className="hamburger-menu">
                        <div className={`hamburger-icon ${isMenuOpen ? "change" : ""}`} id="hamburgerIcon" onClick={toggleMenu}>
                            <div className="bar1"></div>
                            <div className="bar2"></div>
                            <div className="bar3"></div>
                        </div>
                        <div className={`menu-items ${isMenuOpen ? "show-menu" : ""}`} id="menuItems">
                            <span className={styles.link_item}>{name ? `${name}さん` : 'ゲスト'}</span>
                            <a href="/pages/shift"><GrPlan /><span className={styles.link_item}>シフト管理</span></a>
                            <a href="#about"><MdWorkHistory /><span className={styles.link_item}>打刻</span></a>
                            <a href="#services"><RiMoneyCnyCircleFill /><span className={styles.link_item}>給与</span></a>
                            <a href="#contact">{mailOn ? (<IoMailUnreadSharp />):(<IoMailSharp />)}<span className={styles.link_item}>通知</span></a>
                            <a onClick={session ? handleSignOut: handleSignIn} href="#contact">{session ? (<FaSignOutAlt />):(<FaSignInAlt />)}<span className={styles.link_item}>{session ? "サインアウト" : "サインイン"}</span></a>
                        </div>
                    </div>
                    <Breadcrumbs />
                </div>
            </div>

            {/* オーバーレイ */}
            {isMenuOpen && <div className={styles.overlay} onClick={toggleMenu}></div>}
        </>
    );
}

export default function HeaderWrapper() {
    return (
        <UserContextProvider>
            <Header />
        </UserContextProvider>
    )
}