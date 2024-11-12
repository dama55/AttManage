'use client';
import { useState, useEffect } from 'react';
import { useRootLayout, RootLayoutProvider } from '@/contexts/RootLayoutContext';
import CalendarComponent from '@/components/shift/calender';
import EmployeeList from '@/components/employee/Employees';

export default function ExamplePage() {
  const { sidePeakContent, setSidePeakContent, setPopUpContent } = useRootLayout();

  const handleClick = () => {
    // sidePeakContent がある場合は非表示にし、ない場合は表示
    setSidePeakContent(sidePeakContent ? null : <SideContentComponent />);

  }


  return (
    <div>
      <h1>Example Page</h1>
      <p>メインコンテンツがここに表示されます。</p>
      <button onClick={handleClick}>ボタンを押すとサイドピークが変化します</button>
    </div>
  );
}

function SideContentComponent() {
  const [events, setEvents] = useState([]);
  return <div>
    <CalendarComponent events={events} setEvents={setEvents} isEditable={true}/>
    <div>
      <h2>サイドピークのテーブル</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>名前</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>職位</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>山田太郎</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>エンジニア</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>田中一郎</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>デザイナー</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>;

}

function CenterContentComponent() {
  return <div>センターピークのコンテンツ</div>;
}
