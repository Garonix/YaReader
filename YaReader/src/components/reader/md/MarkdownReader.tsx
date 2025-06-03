"use client";

import React, { useState, useEffect } from "react";
import BaseReader, { BaseReaderProps } from "@/components/reader/BaseReader";

interface MarkdownReaderProps extends Omit<BaseReaderProps, 'content'> {
  content?: string;
}

export default function MarkdownReader({
  content = "",
  initialLocation = 0,
  onLocationChange,
  onReady,
}: MarkdownReaderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // 加载Markdown
  useEffect(() => {
    setIsLoading(false);
    if (onReady) {
      onReady();
    }
  }, [content, onReady]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="ml-4">加载Markdown内容...</p>
      </div>
    );
  }
  
  return (
    <div className="h-full p-4 overflow-auto">
      <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert mx-auto">
        <h1>Markdown阅读器</h1>
        <p>Markdown阅读功能正在开发中，请等待后续更新。</p>
        <div className="border p-4 rounded bg-gray-50 dark:bg-gray-800 mt-4">
          <pre className="text-xs">{content.slice(0, 500)}...</pre>
        </div>
      </div>
    </div>
  );
} 