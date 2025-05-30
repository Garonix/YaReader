"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { ReadingMode, ThemeMode } from "@/types/reader";

interface ReaderLayoutProps {
  children: ReactNode;
  title: string;
  onToggleControls?: () => void;
  isControlsVisible?: boolean;
  progress?: number;
  currentPage?: number;
  totalPages?: number;
  chapterTitle?: string;
  onGoBack?: () => void;
}

export function ReaderLayout({
  children,
  title,
  onToggleControls = () => {},
  isControlsVisible = true,
  progress = 0,
  currentPage,
  totalPages,
  chapterTitle,
  onGoBack,
}: ReaderLayoutProps) {
  const [showHeader, setShowHeader] = useState(isControlsVisible);
  const [showFooter, setShowFooter] = useState(isControlsVisible);
  const [theme, setTheme] = useState<ThemeMode>(ThemeMode.LIGHT);
  const [readingMode, setReadingMode] = useState<ReadingMode>(ReadingMode.PAGINATED);

  // 同步控制栏显示状态
  useEffect(() => {
    setShowHeader(isControlsVisible);
    setShowFooter(isControlsVisible);
  }, [isControlsVisible]);

  // 处理点击内容区域的事件
  const handleContentClick = (e: React.MouseEvent) => {
    // 中心区域点击切换控制栏显示状态
    if (e.target === e.currentTarget) {
      onToggleControls();
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-white dark:bg-gray-900 relative">
      {/* 头部控制栏 */}
      <header
        className={`absolute top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 safe-area-top">
          <button
            onClick={onGoBack || (() => window.history.back())}
            className="p-2 -ml-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-base font-medium truncate mx-2">{title}</h1>
          <div className="flex">
            <button
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <button
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 内容区域 */}
      <main 
        className="flex-1 overflow-hidden relative touch-none" 
        onClick={handleContentClick}
      >
        {children}
      </main>

      {/* 底部控制栏 */}
      <footer
        className={`absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 transition-transform duration-300 ${
          showFooter ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="px-4 py-2">
          {/* 进度条 */}
          <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
            <div 
              className="h-full bg-primary-600 dark:bg-primary-500 rounded-full" 
              style={{ width: `${progress * 100}%` }}
            ></div>
          </div>
          
          {/* 章节信息和页码 */}
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span className="truncate max-w-[50%]">{chapterTitle}</span>
            {currentPage && totalPages ? (
              <span>{currentPage} / {totalPages}</span>
            ) : (
              <span>{Math.round(progress * 100)}%</span>
            )}
          </div>

          {/* 阅读控制 */}
          <div className="flex justify-between items-center py-2 safe-area-bottom">
            <button
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
            <div className="flex gap-6">
              <button
                className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
              <button
                className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            <button
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
} 