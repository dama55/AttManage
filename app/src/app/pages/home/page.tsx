// /app/pages/home/page.tsx
'use client';
import { useUserContext } from "@/context/UserContext";
import { useEffect, useState } from "react";
import EmployeeList from '@/components/employee/Employees';
import QrCodeLink from '@/components/QrCodeLink';
import '@/globals.css';

export default function Home() {
  const { role } = useUserContext();

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