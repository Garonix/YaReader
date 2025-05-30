"use client";

import { useState, useEffect, useRef } from "react";
import { BaseReader } from "../BaseReader";
import { BookFormat } from "@/types/book";

// PDF.js需要客户端导入
let pdfjs: any = null;
if (typeof window !== "undefined") {
  pdfjs = require("pdfjs-dist");
  
  // 设置worker
  if (pdfjs) {
    const pdfjsWorker = require("pdfjs-dist/build/pdf.worker.entry");
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  }
}

interface PdfReaderProps {
  bookId: string;
  url: string;
  title: string;
  initialPage?: number;
  initialProgress?: number;
}

export function PdfReader({
  bookId,
  url,
  title,
  initialPage = 1,
  initialProgress = 0,
}: PdfReaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdf, setPdf] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [progress, setProgress] = useState<number>(initialProgress);
  const [scale, setScale] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<string>("");

  // 加载PDF文件
  useEffect(() => {
    if (!pdfjs || !canvasRef.current) return;

    const loadPdf = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 加载PDF文档
        const loadingTask = pdfjs.getDocument(url);
        const pdfDoc = await loadingTask.promise;
        setPdf(pdfDoc);
        setTotalPages(pdfDoc.numPages);
        
        // 设置进度
        if (initialPage && pdfDoc.numPages) {
          const newProgress = (initialPage - 1) / pdfDoc.numPages;
          setProgress(newProgress);
        }

        setIsLoading(false);

      } catch (err: any) {
        console.error("Error loading PDF:", err);
        setError(err.message || "加载PDF文件失败");
        setIsLoading(false);
      }
    };

    loadPdf();
  }, [url, initialPage]);

  // 渲染当前页面
  useEffect(() => {
    if (!pdf || !canvasRef.current) return;

    const renderPage = async () => {
      try {
        // 获取页面
        const page = await pdf.getPage(currentPage);
        
        // 计算缩放比例以适应屏幕宽度
        const viewport = page.getViewport({ scale: 1 });
        let canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 计算适合容器的缩放比例
        let container = containerRef.current;
        if (!container) return;
        
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        // 确定缩放比例
        let calculatedScale = containerWidth / viewport.width;
        // 如果缩放后高度超出容器，则按高度缩放
        if (viewport.height * calculatedScale > containerHeight) {
          calculatedScale = containerHeight / viewport.height;
        }
        
        // 更新缩放比例
        setScale(calculatedScale);
        
        // 使用计算出的缩放比例创建新的视口
        const scaledViewport = page.getViewport({ scale: calculatedScale });
        
        // 设置canvas尺寸
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        
        // 渲染PDF页面到canvas
        const renderContext = {
          canvasContext: ctx,
          viewport: scaledViewport,
        };
        
        await page.render(renderContext).promise;
        
        // 更新页面信息
        let docTitle = "";
        try {
          const metadata = await pdf.getMetadata();
          if (metadata && metadata.info && metadata.info.Title) {
            docTitle = metadata.info.Title;
          }
        } catch (e) {
          console.warn("Could not get PDF metadata:", e);
        }
        
        setPageInfo(docTitle || `第 ${currentPage} 页`);
        
        // 更新进度
        const newProgress = (currentPage - 1) / totalPages;
        setProgress(newProgress);
        
        // 保存阅读位置到本地存储
        if (typeof window !== "undefined") {
          localStorage.setItem(`book_${bookId}_page`, currentPage.toString());
          localStorage.setItem(`book_${bookId}_progress`, newProgress.toString());
        }
        
      } catch (err: any) {
        console.error("Error rendering PDF page:", err);
        setError(err.message || "渲染PDF页面失败");
      }
    };

    renderPage();
  }, [pdf, currentPage, totalPages, bookId]);

  // 页面切换
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // 放大/缩小
  const handleZoom = (zoomIn: boolean) => {
    setScale(prevScale => {
      const newScale = zoomIn ? prevScale * 1.1 : prevScale / 1.1;
      // 限制缩放范围
      return Math.min(Math.max(newScale, 0.5), 3.0);
    });
  };

  return (
    <BaseReader
      bookId={bookId}
      title={title}
      format={BookFormat.PDF}
      initialProgress={progress}
      currentPage={currentPage}
      totalPages={totalPages}
      chapterTitle={pageInfo}
      onPageChange={handlePageChange}
    >
      <div 
        ref={containerRef}
        className="w-full h-full flex items-center justify-center overflow-auto bg-gray-100 dark:bg-gray-800"
      >
        <canvas 
          ref={canvasRef} 
          className="shadow-md"
        />
      </div>
    </BaseReader>
  );
} 