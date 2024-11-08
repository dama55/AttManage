'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import '@/globals.css';
import styles from '@/contexts/RootLayout.module.css';
import { SlArrowRight } from "react-icons/sl"; // アイコンをインポート
import CustomButton from '@/components/CustomButton';

type LayoutContextType = {
  setSidePeakContent: (content: React.ReactNode) => void;
  setPopUpContent: (content: React.ReactNode) => void;
  sidePeakContent: React.ReactNode;
  popUpContent: React.ReactNode;
};


// コンテキストを使ってサイド/センターピークに表示するコンテンツを動的に変更できるようにする
export const LayoutContext = createContext<LayoutContextType | null>(null);

/**
 * コンテキストプロバイダー
 * これでラップしたページはメイン，サイドピーク，ポップアップの三つの
 * ページを自由に設定できるようになる．また，サイドピーク，ホップアップの切り替えは
 * SidePeakContent, setPopUpContentから設定するのみで良い
 */
type RootLayoutProviderProps = {
  children: ReactNode; // childrenの型を指定
};

export function RootLayoutProvider({ children }: RootLayoutProviderProps) {
  const [sidePeakContent, setSidePeakContent] = useState<React.ReactNode>(null);
  const [popUpContent, setPopUpContent] = useState<React.ReactNode>(null);
  const [sidePeakWidth, setSidePeakWidth] = useState(window.innerWidth * 0.25); // 初期幅

  /* ページがアンマウントされる際にコンテンツをリセットする */
  const contextValue = {
    setSidePeakContent,
    setPopUpContent,
    sidePeakContent,
    popUpContent,
  };

  // コンテキストがアンマウントされるときにコンテンツをリセット
  useEffect(() => {
    return () => {
      setSidePeakContent(null);
      setPopUpContent(null);
    };
  }, []);

  // ドラッグ中の幅変更処理
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX;
    document.body.style.backgroundColor = 'lightblue';
  
    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = sidePeakWidth - (e.clientX - startX);

      const maxWidth = window.innerWidth * 0.80; //最大値
      const minWidth = window.innerWidth * 0.25; //最小値
      if (newWidth >= minWidth && newWidth <= maxWidth) { // 最小・最大幅を設定
        setSidePeakWidth(newWidth);
        // リサイズイベントを発火してレイアウト再計算を促す
        window.dispatchEvent(new Event('resize'));
      }
    };
  
    const handleMouseUp = () => {
      document.body.style.backgroundColor = ''; // 元の背景色に戻す
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };


  return (
    <LayoutContext.Provider value={contextValue}>
      <div className={styles.layout}>
        {/* サイドピーク */}
        <aside className={`${styles.side_peak} ${sidePeakContent ? styles.show : ''}`}
        style={{ width: `${sidePeakWidth}px` }}>
          {/* リサイズハンドル */}
          <div
            className={`${styles.resize_handle} ${sidePeakContent ? styles.show : ''}`}
            onMouseDown={handleMouseDown}
            style={{
              right: `${sidePeakContent ? sidePeakWidth : -1000}px`,
            }} /* サイドピークの幅に応じて配置 */
          />
          
          <div className={styles.side_peak_header}>
            {/* CustomButtonを使って閉じるボタンを作成 */}
            <CustomButton onClick={() => setSidePeakContent(null)}>
              <SlArrowRight size={24} />
            </CustomButton>
          </div>
          <div className={styles.side_peak_content}>{sidePeakContent}</div>
        </aside>

        {/* センターピーク */}
        <div className={styles.center_peak}>
          {popUpContent}
        </div>

        {/* メインコンテンツエリア */}
        <main className={styles.main_content}>
          {children}
        </main>
      </div>
    </LayoutContext.Provider>
  );
}

export function useRootLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutContext must be used within a LayoutContextProvider");
  }
  return context;
}