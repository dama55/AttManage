// components/server/Employees.ts
//従業員情報を取り出すサーバーサイドコンポーネント
import React from 'react';

interface User {
    userId: string;
    name: string;
    role: string;
}

export default async function EmployeeListServ({children, ...props}: any) {
    // サーバーサイドで従業員データを取得
    const fetchEmployees = async (): Promise<User[]> => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/users`, { 
            cache: 'no-store' // サーバーサイドで常に新しいデータを取得する
        });
        if (!response.ok) {
            throw new Error("Failed to fetch employee data");
        }
        return response.json();
    };

    const users = await fetchEmployees(); // データを取得

    return (
        <>
            {React.cloneElement(children, { users, ...props })}
        </>
    );
}