// /app/pages/home/page.tsx
import EmployeeList from '@/components/employee/Employees';
import EmployeeListServ from "@/components/server/EmployeeListServ";
import QrCodeLinkWrapper from '@/components/QrCodeLink';
import '@/globals.css';

export default function Home() {

  return (
    <div>
      <h1>ホームページ</h1>
      <div>
        <span>事業所名称:</span>
        <span>開発用テスト事業所</span>
      </div>
      
      <EmployeeListServ>
        <EmployeeList/>  
      </EmployeeListServ> {/* 従業員一覧を表示するコンポーネント */}
      {/* role を props として QrCodeLink に渡す */}
      <QrCodeLinkWrapper />

    </div>
  );
}