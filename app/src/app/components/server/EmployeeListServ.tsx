// components/server/Employees.ts
//従業員情報を取り出すサーバーサイドコンポーネント
import { getAllUsers } from '@/modules/userModules';
import React from 'react';

interface User {
    userId: string;
    name: string;
    role: string;
}

export default async function EmployeeListServ({children, ...props}: any) {
    let users: User[] = [];
    // サーバーサイドで従業員データを取得
    try {
        users = await getAllUsers(); // データベースから直接従業員データを取得
    } catch (error) {
        console.error("Failed to load employee data:", error);
        return <div>Failed to load employee data. Please try again later.</div>;
    }


    return (
        <>
            {React.cloneElement(children, { users, ...props })}
        </>
    );
}