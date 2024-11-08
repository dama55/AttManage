import React, { createContext, useContext, useState } from 'react';
import './globals.css';

// コンテキストを使ってサイド/センターピークに表示するコンテンツを動的に変更できるようにする
export const LayoutContext = createContext();

export function useLayout() {
  return useContext(LayoutContext);
}

export default function RootLayout({ children }) {
  const [sidePeakContent, setSidePeakContent] = useState(null);
  const [centerPeakContent, setCenterPeakContent] = useState(null);

  return (
    <LayoutContext.Provider value={{ setSidePeakContent, setCenterPeakContent }}>
      <div className="layout">
        {/* サイドピーク */}
        <aside className="side-peak">
          {sidePeakContent}
        </aside>

        {/* センターピーク */}
        <div className="center-peak">
          {centerPeakContent}
        </div>

        {/* メインコンテンツエリア */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </LayoutContext.Provider>
  );
}