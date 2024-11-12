// layoutConfig.ts
import React from 'react';
import HeaderWrapper from "@/components/Header";
import EmployeeListServ from "@/components/server/EmployeeListServ";

export function layoutConfig(pathname: string | null) {
    let layout;

    switch (pathname) {
        case '/pages/signin':
        case '/pages/signup':
            layout = { showHeader: false, wrapper: React.Fragment };
            break;
        case '/pages/home':
            layout = { showHeader: true, wrapper: EmployeeListServ };
            break;
        default:
            layout = { showHeader: true, wrapper: React.Fragment }; // デフォルト設定
            break;
    }

    return layout;
};