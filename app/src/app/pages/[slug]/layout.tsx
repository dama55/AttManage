// src/app/layout.tsx
import React from 'react';
import HeaderWrapper from "@/components/Header"; // Headerをインポート
import EmployeeListServ from "@/components/server/EmployeeListServ";
import { layoutConfig } from "@/pages/layoutConfig";

export default function RootLayout({
    children,
    params,
    }: { 
        children: React.ReactNode;
        params: { slug: string }; 
    }) {
    const pathname = params.slug;
    console.log("slug: ", pathname);
    const layout = layoutConfig(pathname);

    // 特定のパスによってヘッダーを非表示にする例
    const showHeader = layout.showHeader
    // ホームページなど特定のパスでラッパーコンポーネントを使用
    const EmployeeListWrapper = layout.wrapper || React.Fragment;
    return (
        <>
            {showHeader && <HeaderWrapper />}
            <EmployeeListWrapper>{children}</EmployeeListWrapper>
        </>
    );
}