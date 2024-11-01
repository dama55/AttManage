'use client';
import { useEffect, useState } from 'react';

interface User {
    id: number;
    name: string;
    role: string;
}

export default function EmployeeList() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        // APIからユーザー情報を取得
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/auth/users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

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
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}