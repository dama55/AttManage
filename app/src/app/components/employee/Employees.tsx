'use client';
import { useEffect, useState } from 'react';

interface User {
    userId: string;
    name: string;
    role: string;
}

export default function EmployeeList({...props}) {

    return (
        <div>
            <h3>従業員一覧</h3>
            <table border={1}>
                <thead>
                    <tr>
                        <th>従業員番号</th>
                        <th>名前</th>
                        <th>役職</th>
                    </tr>
                </thead>
                <tbody>
                    {props.users.map((user:any) => (
                        <tr key={user.userId}>
                            <td>{user.userId}</td>
                            <td>{user.name}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}