"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import BaseReader, { BaseReaderProps } from "@/components/reader/BaseReader";

interface TxtReaderProps extends Omit<BaseReaderProps, 'content'> {
  content?: string;
}

export default function TxtReader({
  content = "",
  initialLocation = 0,
  onLocationChange,
  onReady,
}: TxtReaderProps) {
  const [pages, setPages] = useState<string[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(typeof initialLocation === 'number' ? initialLocation : 0);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.5);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 文本分页处理
  useEffect(() => {
    if (!content || !containerRef.current) return;
    
    const paginateText = () => {
      const container = containerRef.current;
      if (!container) return [];
      
      const testDiv = document.createElement('div');
      testDiv.style.position = 'absolute';
      testDiv.style.visibility = 'hidden';
      testDiv.style.width = `${container.clientWidth}px`;
      testDiv.style.fontSize = `${fontSize}px`;
      testDiv.style.lineHeight = `${lineHeight}`;
      testDiv.style.whiteSpace = 'pre-wrap';
      testDiv.style.wordBreak = 'break-word';
      document.body.appendChild(testDiv);
      
      const height = container.clientHeight;
      const textChunks = [];
      let currentChunk = '';
      const paragraphs = content.split('\n');
      
      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        
        // 测试添加新段落后是否超出高度
        testDiv.textContent = currentChunk + paragraph + '\n';
        
        if (testDiv.scrollHeight > height && currentChunk !== '') {
          // 当前页面已满，存储当前块并重新开始
          textChunks.push(currentChunk);
          currentChunk = paragraph + '\n';
        } else {
          // 将段落添加到当前块
          currentChunk += paragraph + '\n';
        }
        
        // 处理最后一个段落
        if (i === paragraphs.length - 1 && currentChunk !== '') {
          textChunks.push(currentChunk);
        }
      }
      
      document.body.removeChild(testDiv);
      return textChunks;
    };
    
    const chunkedPages = paginateText() || [content];
    setPages(chunkedPages);
    
    if (onReady) {
      onReady();
    }
  }, [content, fontSize, lineHeight, onReady]);
  
  // 处理页面切换
  const goToPage = useCallback((pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < pages.length) {
      setCurrentPageIndex(pageIndex);
      if (onLocationChange) {
        onLocationChange(pageIndex);
      }
    }
  }, [pages.length, onLocationChange]);
  
  // 处理下一页
  const goToNextPage = useCallback(() => {
    goToPage(currentPageIndex + 1);
  }, [currentPageIndex, goToPage]);
  
  // 处理上一页
  const goToPrevPage = useCallback(() => {
    goToPage(currentPageIndex - 1);
  }, [currentPageIndex, goToPage]);
  
  // 滑动手势处理
  const swipeHandlers = useSwipeable({
    onSwipedLeft: goToNextPage,
    onSwipedRight: goToPrevPage,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });
  
  return (
    <div className="h-full relative" {...swipeHandlers}>
      <div 
        ref={containerRef}
        className="h-full p-4 overflow-hidden"
      >
        {pages.length > 0 && (
          <div 
            className="text-reader-content"
            style={{ 
              fontSize: `${fontSize}px`, 
              lineHeight: `${lineHeight}`,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            {pages[currentPageIndex]}
          </div>
        )}
      </div>
      
      {/* 翻页箭头 */}
      {currentPageIndex > 0 && (
        <button 
          className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/70 dark:bg-gray-800/70 shadow-md"
          onClick={goToPrevPage}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      
      {currentPageIndex < pages.length - 1 && (
        <button 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/70 dark:bg-gray-800/70 shadow-md"
          onClick={goToNextPage}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
} 