// src/app/layout.tsx
import React from 'react';
import HeaderWrapper from "@/components/Header"; // Headerをインポート
import EmployeeListServ from "@/components/server/EmployeeListServ";
import { layoutConfig } from "@/pages/layoutConfig";
import { RootLayoutProvider } from '@/contexts/RootLayoutContext';

export default function RootLayout({ 
    children,
    }: { 
        children: React.ReactNode;
    }) {

    return (
        <>
            <HeaderWrapper />
            <RootLayoutProvider>
                {children}
            </RootLayoutProvider>
        </>
    );
}