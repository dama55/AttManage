// src/app/layout.tsx

import HeaderWrapper from "@/components/Header"; // Headerをインポート

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <HeaderWrapper />
            {children}
        </>
    );
}