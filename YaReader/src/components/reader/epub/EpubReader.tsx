"use client";

import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import BaseReader, { BaseReaderProps } from "@/components/reader/BaseReader";

interface EpubReaderProps extends Omit<BaseReaderProps, 'content'> {
  content?: string;
}

export default function EpubReader({
  content = "",
  initialLocation = 0,
  onLocationChange,
  onReady,
}: EpubReaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // EPUB处理逻辑（简化版）
    setTimeout(() => {
      setIsLoading(false);
      if (onReady) {
        onReady();
      }
    }, 1000);
  }, [content, onReady]);
  
  // 滑动手势处理
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      console.log("下一页");
      if (onLocationChange) {
        onLocationChange(typeof initialLocation === 'number' ? initialLocation + 1 : 1);
      }
    },
    onSwipedRight: () => {
      console.log("上一页");
      if (onLocationChange) {
        onLocationChange(typeof initialLocation === 'number' ? initialLocation - 1 : 0);
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="ml-4">加载EPUB内容...</p>
      </div>
    );
  }
  
  return (
    <div className="h-full relative" {...swipeHandlers}>
      <div className="h-full p-4 overflow-hidden">
        <div className="prose max-w-none">
          <h1>EPUB阅读器</h1>
          <p>EPUB阅读功能正在开发中，请等待后续更新。</p>
          <div className="border p-4 rounded bg-gray-50 dark:bg-gray-800 mt-4">
            <pre className="text-xs">{content.slice(0, 500)}...</pre>
          </div>
        </div>
      </div>
    </div>
  );
} 