"use client";

import { useState, useEffect, useRef } from "react";
import { BaseReader } from "../BaseReader";
import { BookFormat } from "@/types/book";
import { TocItem } from "@/types/reader";
import { Book as EpubBook } from "epubjs";

// 导入 epubjs 时需要特殊处理（仅客户端使用）
let Epub: any = null;
if (typeof window !== "undefined") {
  Epub = require("epubjs");
}

interface EpubReaderProps {
  bookId: string;
  url: string;
  title: string;
  initialLocation?: string;
  initialProgress?: number;
}

export function EpubReader({
  bookId,
  url,
  title,
  initialLocation,
  initialProgress = 0,
}: EpubReaderProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [book, setBook] = useState<EpubBook | null>(null);
  const [rendition, setRendition] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<string | null>(initialLocation || null);
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [progress, setProgress] = useState<number>(initialProgress);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [chapterTitle, setChapterTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 加载EPUB文件
  useEffect(() => {
    if (!Epub || !viewerRef.current) return;

    const initializeBook = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 创建新的EPUB实例
        const newBook = Epub(url);
        await newBook.ready;
        setBook(newBook);

        // 创建渲染器
        const newRendition = newBook.renderTo(viewerRef.current, {
          width: "100%",
          height: "100%",
          spread: "none",
          flow: "paginated",
        });

        // 设置字体和样式
        newRendition.themes.fontSize("100%");
        newRendition.themes.register("light", {
          body: { 
            color: "#333333", 
            background: "#ffffff" 
          }
        });
        newRendition.themes.register("dark", {
          body: { 
            color: "#cccccc", 
            background: "#121212" 
          }
        });
        newRendition.themes.register("sepia", {
          body: { 
            color: "#5b4636", 
            background: "#f4ecd8" 
          }
        });

        // 应用默认主题
        newRendition.themes.select("light");

        // 设置默认字体和边距
        newRendition.themes.override("p", {
          "font-family": "'Noto Serif SC', serif, sans-serif",
          "line-height": "1.5em",
          "margin": "0.5em 0",
        });

        // 如果有初始位置则加载到该位置
        if (initialLocation) {
          await newRendition.display(initialLocation);
        } else {
          await newRendition.display();
        }

        // 获取目录
        const navItems = await newBook.navigation.getNavItems();
        const tocItems = navItems.map((item: any) => ({
          id: item.id,
          label: item.label,
          href: item.href,
          level: 0, // 简化处理，默认为0级
        }));
        setToc(tocItems);

        // 注册事件监听
        newRendition.on("locationChanged", (location: any) => {
          const loc = location.start.cfi;
          setCurrentLocation(loc);
          
          // 计算阅读进度
          const percentage = newBook.locations.percentageFromCfi(loc);
          setProgress(percentage);
          
          // 获取当前章节标题
          const chapter = tocItems.find((item: TocItem) => 
            loc.indexOf(item.href) > -1 || item.href.indexOf(loc) > -1
          );
          if (chapter) {
            setChapterTitle(chapter.label);
          }
          
          // 保存阅读位置到本地存储
          if (typeof window !== "undefined") {
            localStorage.setItem(`book_${bookId}_location`, loc);
            localStorage.setItem(`book_${bookId}_progress`, percentage.toString());
          }
        });

        // 设置渲染器和其他状态
        setRendition(newRendition);
        setIsLoading(false);

        // 计算总页数（估算）
        const pageList = await newBook.locations.generate(1024);
        setTotalPages(pageList.length);

      } catch (err: any) {
        console.error("Error loading EPUB:", err);
        setError(err.message || "加载EPUB文件失败");
        setIsLoading(false);
      }
    };

    initializeBook();

    return () => {
      // 清理
      if (book) {
        book.destroy();
      }
    };
  }, [bookId, url, initialLocation]);

  // 翻页处理函数
  const handlePageChange = (direction: "next" | "prev") => {
    if (!rendition) return;
    
    if (direction === "next") {
      rendition.next();
    } else {
      rendition.prev();
    }
  };

  // 翻到指定页码
  const goToPage = (page: number) => {
    if (!book || !rendition || !toc || page < 1 || page > (totalPages || 0)) return;
    
    // 计算页码对应的CFI位置
    const totalLocs = book.locations.total;
    const locPerPage = totalLocs / (totalPages || 1);
    const locIndex = Math.floor((page - 1) * locPerPage);
    const cfi = book.locations.cfiFromLocation(locIndex);
    
    if (cfi) {
      rendition.display(cfi);
      setCurrentPage(page);
    }
  };

  // 当用户从BaseReader组件请求页面变化时
  const handlePageRequest = (page: number) => {
    if (currentPage === null) return;
    
    if (page > currentPage) {
      handlePageChange("next");
    } else if (page < currentPage) {
      handlePageChange("prev");
    }
  };

  return (
    <BaseReader
      bookId={bookId}
      title={title}
      format={BookFormat.EPUB}
      initialProgress={progress}
      currentPage={currentPage}
      totalPages={totalPages}
      chapterTitle={chapterTitle}
      onPageChange={handlePageRequest}
    >
      <div 
        ref={viewerRef} 
        className="w-full h-full bg-white dark:bg-gray-900"
      ></div>
    </BaseReader>
  );
} 