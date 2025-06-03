"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { loadBookFromFile } from "@/lib/bookLoader";
import { saveBookToLocalStorage } from "@/lib/bookLoader";
import { useRouter } from "next/navigation";

export default function TestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 测试加载TXT文件
  const testLoadTxtFile = async () => {
    setIsLoading(true);
    setError(null);
    setMessage("正在加载TXT文件...");
    
    try {
      // 模拟从文件系统加载文件
      // 注意：在浏览器环境中，我们无法直接访问服务器的文件系统
      // 这里我们使用fetch API从服务器获取文件
      const response = await fetch('/api/test-books/txt');
      
      if (!response.ok) {
        throw new Error(`加载失败: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const file = new File([blob], "剑来.txt", { type: "text/plain" });
      
      // 加载文件内容
      setMessage("正在解析TXT文件内容...");
      const book = await loadBookFromFile(file);
      
      // 保存到本地存储
      setMessage("正在保存到本地存储...");
      await saveBookToLocalStorage(book);
      
      setMessage(`TXT文件加载成功！书名: ${book.title}, ID: ${book.id}`);
      
      // 导航到阅读页面
      setTimeout(() => {
        router.push(`/reader/txt/${book.id}`);
      }, 2000);
      
    } catch (err: any) {
      console.error("测试加载TXT文件错误:", err);
      setError(err.message || "加载TXT文件时出错");
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };
  
  // 测试加载EPUB文件
  const testLoadEpubFile = async () => {
    setIsLoading(true);
    setError(null);
    setMessage("正在加载EPUB文件...");
    
    try {
      // 从服务器获取文件
      const response = await fetch('/api/test-books/epub');
      
      if (!response.ok) {
        throw new Error(`加载失败: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const file = new File([blob], "怪谈研究室.epub", { type: "application/epub+zip" });
      
      // 加载文件内容
      setMessage("正在解析EPUB文件内容...");
      const book = await loadBookFromFile(file);
      
      // 保存到本地存储
      setMessage("正在保存到本地存储...");
      await saveBookToLocalStorage(book);
      
      setMessage(`EPUB文件加载成功！书名: ${book.title}, ID: ${book.id}`);
      
      // 导航到阅读页面
      setTimeout(() => {
        router.push(`/reader/epub/${book.id}`);
      }, 2000);
      
    } catch (err: any) {
      console.error("测试加载EPUB文件错误:", err);
      setError(err.message || "加载EPUB文件时出错");
      setMessage("");
    } finally {
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
          <h1 className="text-2xl font-bold">测试页面</h1>
        </div>
      </header>
      
      <main className="flex-grow p-4 container max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">测试文件加载</h2>
          
          {message && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-md">
              <p>{message}</p>
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md">
              <p>{error}</p>
            </div>
          )}
          
          <div className="flex flex-col space-y-4">
            <Button 
              onClick={testLoadTxtFile}
              disabled={isLoading}
              isLoading={isLoading && message.includes("TXT")}
            >
              测试加载TXT文件 (剑来.txt)
            </Button>
            
            <Button 
              onClick={testLoadEpubFile}
              disabled={isLoading}
              isLoading={isLoading && message.includes("EPUB")}
              variant="outline"
            >
              测试加载EPUB文件 (怪谈研究室.epub)
            </Button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">注意事项</h2>
          
          <ul className="list-disc pl-5 space-y-2">
            <li>测试页面需要配合API路由使用，请确保已创建相应的API路由</li>
            <li>API路由应该位于 <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">src/app/api/test-books/[format]/route.ts</code></li>
            <li>大文件加载可能需要较长时间，请耐心等待</li>
            <li>如果加载失败，请检查浏览器控制台以获取详细错误信息</li>
          </ul>
        </div>
      </main>
    </div>
  );
} 