// /app/pages/home/page.tsx
'use client';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import EmployeeList from '@/components/employee/Employees';
import QrCodeLink from '@/components/QrCodeLink';
import '@/globals.css';

export default function Home() {
  const { data: session } = useSession();
  const [role, setRole] = useState<string | null>(null);

  // ロールを取得するためのAPI呼び出し
  useEffect(() => {
    const fetchRole = async () => {
      if (session?.user.id) {
        try {
          const response = await fetch(`/api/auth/user?id=${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setRole(data.role);
          } else {
            console.error("Failed to fetch role");
          }
        } catch (error) {
          console.error("Error fetching role:", error);
        }
      }
    };

    fetchRole();
  }, [session]);

  return (
    <div>
      <h1>ホームページ</h1>
      <div>
        <span>事業所名称:</span>
        <span>開発用テスト事業所</span>
      </div>
      <EmployeeList /> {/* 従業員一覧を表示するコンポーネント */}
      {/* role を props として QrCodeLink に渡す */}
      <QrCodeLink role={role} />
    </div>
  );
}