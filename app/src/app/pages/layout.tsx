// src/app/layout.tsx
'use client'; // クライアントコンポーネントとして設定

import { SessionContextProvider } from "@/context/SessionContext";
import { UserContextProvider } from "@/context/UserContext";
import Header from "@/components/Header"; // Headerをインポート

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionContextProvider>
            <UserContextProvider>
                {/* HeaderをSessionContextProvider内に配置 */}
                <Header />
            </UserContextProvider>
            {children}
        </SessionContextProvider>
    );
}