"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";
import { useSwipeable } from "react-swipeable";

export interface BaseReaderProps {
  content?: string | ArrayBuffer | null;
  initialLocation?: string | number;
  onLocationChange?: (location: string | number) => void;
  onReady?: () => void;
  children?: ReactNode;
  // 添加PdfReader中使用的属性
  bookId?: string;
  title?: string;
  format?: any;
  initialProgress?: number;
  currentPage?: number;
  totalPages?: number;
  chapterTitle?: string;
  onPageChange?: (page: number) => void;
}

export default function BaseReader({
  content,
  initialLocation,
  onLocationChange,
  onReady,
  children,
  bookId,
  title,
  currentPage = 1,
  totalPages = 1,
  chapterTitle,
  onPageChange,
}: BaseReaderProps) {
  const [isReady, setIsReady] = useState(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const readerRef = useRef<HTMLDivElement>(null);
  
  // 隐藏工具栏的定时器
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    const hideToolbar = () => {
      if (isToolbarVisible) {
        timeoutId = setTimeout(() => {
          setIsToolbarVisible(false);
        }, 3000);
      }
    };
    
    hideToolbar();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isToolbarVisible]);
  
  // 点击显示/隐藏工具栏
  const handleContentClick = () => {
    setIsToolbarVisible(!isToolbarVisible);
  };
  
  // 滑动手势处理
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      // 下一页逻辑
      console.log("下一页");
    },
    onSwipedRight: () => {
      // 上一页逻辑
      console.log("上一页");
    },
  });
  
  return (
    <div className="reader-view h-screen w-screen bg-reader-paper text-reader-ink dark:bg-gray-900 dark:text-gray-100">
      {/* 阅读内容区域 */}
      <div 
        ref={readerRef}
        className="reader-content h-full w-full overflow-hidden"
        onClick={handleContentClick}
        {...swipeHandlers}
      >
        {/* 如果有子元素则显示子元素，否则显示默认内容 */}
        {children ? (
          children
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>请在子类中实现具体的内容渲染</p>
          </div>
        )}
      </div>
      
      {/* 顶部工具栏 */}
      <div className={`toolbar fixed top-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 safe-area-top ${isToolbarVisible ? '' : 'hidden'}`}>
        <div className="flex items-center justify-between p-4">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* 底部工具栏 */}
      <div className={`toolbar fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 safe-area-bottom ${isToolbarVisible ? '' : 'hidden'}`}>
        <div className="flex items-center justify-between p-4">
          <div className="text-sm">
            <span>{chapterTitle || `第${currentPage}页 / 共${totalPages}页`}</span>
          </div>
          <div className="flex space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 