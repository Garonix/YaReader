"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { loadBookFromFile, saveBookToLocalStorage, BookData } from "@/lib/bookLoader";

// 最大允许的文件大小 (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export default function ImportPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError(`文件大小超过限制 (${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB)`);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.size > MAX_FILE_SIZE) {
        setError(`文件大小超过限制 (${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB)`);
        return;
      }
      setFile(droppedFile);
      setError(null);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleImport = async () => {
    if (!file) {
      setError("请选择要导入的文件");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 加载文件内容
      const book = await loadBookFromFile(file);
      
      // 保存到本地存储
      await saveBookToLocalStorage(book);
      
      // 导航到阅读页面
      router.push(`/reader/${book.format}/${book.id}`);
    } catch (err: any) {
      console.error("导入错误:", err);
      let errorMessage = err.message || "导入文件时出错";
      
      // 处理常见错误
      if (errorMessage.includes("QuotaExceededError") || errorMessage.includes("Storage")) {
        errorMessage = "存储空间不足，请清理浏览器缓存后重试";
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold">导入书籍</h1>
        </div>
      </header>
      
      <main className="flex-grow p-4 container max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">选择文件</h2>
          
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center mb-6 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".txt,.epub,.pdf,.md"
              onChange={handleFileChange}
            />
            
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            
            <p className="mb-1">点击或拖放文件到此处</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">支持 .txt, .epub, .pdf, .md 格式</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">文件大小上限: {Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB</p>
            
            {file && (
              <div className="mt-4 py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded text-left flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="truncate block">{file.name}</span>
                  <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </div>
            )}
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md">
              <p>{error}</p>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button 
              onClick={handleImport}
              disabled={!file || isLoading}
              isLoading={isLoading}
            >
              导入
            </Button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">支持的格式</h2>
          
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded text-xs uppercase mr-3 mt-0.5">TXT</span>
              <div>
                <p className="font-medium">文本文件</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">支持UTF-8编码的纯文本文件</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs uppercase mr-3 mt-0.5">EPUB</span>
              <div>
                <p className="font-medium">电子书格式</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">支持EPUB 2和EPUB 3标准格式</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded text-xs uppercase mr-3 mt-0.5">PDF</span>
              <div>
                <p className="font-medium">PDF文档</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">支持标准PDF格式</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded text-xs uppercase mr-3 mt-0.5">MD</span>
              <div>
                <p className="font-medium">Markdown</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">支持标准Markdown格式</p>
              </div>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
} 