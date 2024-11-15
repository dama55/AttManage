// src/app/components/Breadcrumbs.tsx

'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Breadcrumbs.module.css';

// カスタムラベルを定義するオブジェクト
const breadcrumbLabels: { [key: string]: string } = {
    '/pages': 'ホーム',
    '/pages/shift/req': 'シフト要求',
    '/pages/shift/plan': 'シフト決定',
    '/pages/shift': 'シフト管理',


    // 必要に応じて追加
};

// カスタムラベルを取得する関数
const getLabel = (href: string) => {
    return breadcrumbLabels[href] || href.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

const Breadcrumbs = () => {
    const pathname = usePathname();  // `usePathname` を使用して現在のパスを取得
    const pathSegments = pathname.split('/').filter(seg => seg);

    console.log("pathSeg: ", pathSegments);

    const breadcrumbs = pathSegments.map((segment, index) => {
        const href = '/' + pathSegments.slice(0, index + 1).join('/');
        const title = getLabel(href);
        return { title, href };
    });

    return (
        <nav aria-label="パンくずリスト" className={styles.breadcrumbs}>
            <ul>
                {breadcrumbs.map((crumb, index) => (
                    <li key={index}>
                        <Link href={crumb.href} className={styles.link}>
                            <div className={styles.item}>
                                {crumb.title}
                            </div>
                        </Link>
                        <span className={styles.separator}>/</span>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Breadcrumbs;
