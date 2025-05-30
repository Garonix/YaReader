"use client";

import { useState, useEffect } from "react";
import { BaseReader } from "../BaseReader";
import { BookFormat } from "@/types/book";

// React-Markdown需要客户端导入
let ReactMarkdown: any = null;
let remarkGfm: any = null;
let rehypeRaw: any = null;

if (typeof window !== "undefined") {
  ReactMarkdown = require("react-markdown").default;
  remarkGfm = require("remark-gfm");
  rehypeRaw = require("rehype-raw");
}

interface MarkdownReaderProps {
  bookId: string;
  url: string;
  title: string;
  initialProgress?: number;
}

export function MarkdownReader({
  bookId,
  url,
  title,
  initialProgress = 0,
}: MarkdownReaderProps) {
  const [markdown, setMarkdown] = useState<string>("");
  const [progress, setProgress] = useState<number>(initialProgress);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [totalHeight, setTotalHeight] = useState<number>(1);

  // 加载Markdown文件
  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`网络响应错误: ${response.status}`);
        }

        const text = await response.text();
        setMarkdown(text);
        setIsLoading(false);

        // 恢复上次滚动位置
        if (typeof window !== "undefined") {
          const savedScrollPercentage = localStorage.getItem(`book_${bookId}_scroll`);
          if (savedScrollPercentage) {
            const savedProgress = parseFloat(savedScrollPercentage);
            setProgress(savedProgress);
            
            // 在内容加载后设置滚动位置
            setTimeout(() => {
              const contentElement = document.getElementById("md-content");
              if (contentElement) {
                const newScrollPosition = contentElement.scrollHeight * savedProgress;
                contentElement.scrollTop = newScrollPosition;
              }
            }, 100);
          }
        }

      } catch (err: any) {
        console.error("Error loading Markdown:", err);
        setError(err.message || "加载Markdown文件失败");
        setIsLoading(false);
      }
    };

    fetchMarkdown();
  }, [url, bookId]);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      const contentElement = document.getElementById("md-content");
      if (contentElement) {
        const { scrollTop, scrollHeight, clientHeight } = contentElement;
        setScrollPosition(scrollTop);
        setTotalHeight(scrollHeight - clientHeight);

        // 计算阅读进度
        const newProgress = Math.min(scrollTop / (scrollHeight - clientHeight), 1);
        setProgress(newProgress);

        // 保存滚动位置到本地存储
        if (typeof window !== "undefined") {
          localStorage.setItem(`book_${bookId}_scroll`, newProgress.toString());
          localStorage.setItem(`book_${bookId}_progress`, newProgress.toString());
        }
      }
    };

    const contentElement = document.getElementById("md-content");
    if (contentElement) {
      contentElement.addEventListener("scroll", handleScroll);
      return () => contentElement.removeEventListener("scroll", handleScroll);
    }
  }, [bookId]);

  // 页面切换处理（这里是滚动控制）
  const handlePageChange = (direction: "up" | "down") => {
    const contentElement = document.getElementById("md-content");
    if (!contentElement) return;

    // 每次滚动一屏高度
    const scrollAmount = contentElement.clientHeight * 0.9;
    
    if (direction === "down") {
      contentElement.scrollBy({ top: scrollAmount, behavior: "smooth" });
    } else {
      contentElement.scrollBy({ top: -scrollAmount, behavior: "smooth" });
    }
  };

  // BaseReader的页面切换请求处理
  const handlePageRequest = (page: number) => {
    // 这里将page视为方向指示，大于当前页面向下，小于当前页面向上
    if (page > 0) {
      handlePageChange("down");
    } else {
      handlePageChange("up");
    }
  };

  if (!ReactMarkdown || !remarkGfm || !rehypeRaw) {
    return (
      <BaseReader
        bookId={bookId}
        title={title}
        format={BookFormat.MD}
        initialProgress={progress}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p>加载组件中...</p>
          </div>
        </div>
      </BaseReader>
    );
  }

  return (
    <BaseReader
      bookId={bookId}
      title={title}
      format={BookFormat.MD}
      initialProgress={progress}
      onPageChange={handlePageRequest}
    >
      <div 
        id="md-content"
        className="w-full h-full overflow-auto bg-white dark:bg-gray-900 p-4"
      >
        <article className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert mx-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {markdown}
          </ReactMarkdown>
        </article>
      </div>
    </BaseReader>
  );
} 