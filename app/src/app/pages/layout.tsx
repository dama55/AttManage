// src/app/layout.tsx
'use client'; // クライアントコンポーネントとして設定

import { SessionProvider } from "next-auth/react";
import Header from "@/components/Header"; // Headerをインポート

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
                <SessionProvider>
                    {/* HeaderをSessionProvider内に配置 */}
                    <Header />
                    {children}
                </SessionProvider>
    );
}