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
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 文本分页处理
  useEffect(() => {
    if (!content || !containerRef.current) return;
    
    // 对于大文件，使用优化的异步分页处理
    const paginateTextAsync = async () => {
      setIsLoading(true);
      
      // 创建一个隐藏的测试div用于计算文本高度
      const testDiv = document.createElement('div');
      testDiv.style.position = 'absolute';
      testDiv.style.visibility = 'hidden';
      testDiv.style.width = `${containerRef.current?.clientWidth || 300}px`;
      testDiv.style.fontSize = `${fontSize}px`;
      testDiv.style.lineHeight = `${lineHeight}`;
      testDiv.style.whiteSpace = 'pre-wrap';
      testDiv.style.wordBreak = 'break-word';
      document.body.appendChild(testDiv);
      
      const height = containerRef.current?.clientHeight || 500;
      const textChunks: string[] = [];
      
      // 将内容分割为段落
      const paragraphs = content.split('\n');
      const totalParagraphs = paragraphs.length;
      let currentChunk = '';
      
      // 使用Web Worker或requestAnimationFrame进行分页，避免阻塞UI
      const processBatch = (startIndex: number, batchSize: number) => {
        return new Promise<number>((resolve) => {
          // 使用setTimeout来避免长时间阻塞主线程
          setTimeout(() => {
            const endIndex = Math.min(startIndex + batchSize, totalParagraphs);
            
            for (let i = startIndex; i < endIndex; i++) {
              const paragraph = paragraphs[i];
              
              // 优化：只有当段落非空时才进行处理
              if (paragraph.trim() === '') {
                currentChunk += '\n';
                continue;
              }
              
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
              if (i === totalParagraphs - 1 && currentChunk !== '') {
                textChunks.push(currentChunk);
              }
            }
            
            // 更新进度 - 只在每批处理后更新一次以减少重渲染
            setLoadingProgress(Math.floor((endIndex / totalParagraphs) * 100));
            
            resolve(endIndex);
          }, 0);
        });
      };
      
      // 分批处理段落，增加批处理大小以提高效率
      const BATCH_SIZE = 2000; // 增加每批处理的段落数
      let processedIndex = 0;
      
      while (processedIndex < totalParagraphs) {
        processedIndex = await processBatch(processedIndex, BATCH_SIZE);
      }
      
      // 清理
      document.body.removeChild(testDiv);
      
      // 确保至少有一页
      if (textChunks.length === 0 && content.trim() !== '') {
        textChunks.push(content);
      }
      
      setPages(textChunks);
      setIsLoading(false);
      
      if (onReady) {
        onReady();
      }
    };
    
    // 使用setTimeout延迟执行，让UI先渲染
    setTimeout(() => {
      paginateTextAsync();
    }, 100);
    
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
  
  // 加载状态展示
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
          <div 
            className="h-full bg-primary-600 dark:bg-primary-500 rounded-full transition-all duration-300" 
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          正在处理文本 ({loadingProgress}%)...
        </p>
        <p className="text-xs text-gray-500 mt-2">
          大文件处理可能需要一些时间，请耐心等待
        </p>
      </div>
    );
  }
  
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
      
      {/* 页面指示器 */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
        <div className="bg-white/70 dark:bg-gray-800/70 px-2 py-1 rounded text-xs">
          {currentPageIndex + 1} / {pages.length}
        </div>
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