"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import TxtReader from "@/components/reader/txt/TxtReader";
import EpubReader from "@/components/reader/epub/EpubReader";
import BaseReader from "@/components/reader/BaseReader";
import { loadBookFromLocalStorage, BookData } from "@/lib/bookLoader";

interface Book {
  id: string;
  title: string;
  author: string;
  format: string;
  content: string;
}

// 模拟书籍数据
const mockBooks: Record<string, Book> = {
  "1": {
    id: "1",
    title: "三体",
    author: "刘慈欣",
    format: "epub",
    content: "这是三体的测试内容。\n\n这是第一章。\n\n宇宙很大，生命很小。\n\n但是宇宙如此广阔，不可能没有其他文明的存在。\n\n这本书讲述了人类与三体文明的第一次接触。"
  },
  "2": {
    id: "2",
    title: "活着",
    author: "余华",
    format: "epub",
    content: "这是活着的测试内容。\n\n这是第一章：命运。\n\n我比现在年轻十岁的时候，获得了一个游手好闲的职业，去乡间收集民间歌谣。\n\n那一年的整个夏天，我如同一个游手好闲的少爷，在知了和阳光充斥的村庄里闲逛，把收集来的歌谣编写成书，准备拿到城里印刷出版。"
  },
  "3": {
    id: "3",
    title: "JavaScript高级程序设计",
    author: "Nicholas C. Zakas",
    format: "pdf",
    content: "这是JavaScript高级程序设计的测试内容。\n\n第1章 JavaScript简介\n\n本章内容\n- JavaScript历史回顾\n- JavaScript是什么\n- JavaScript与ECMAScript的关系\n- JavaScript的不同版本\n\nJavaScript诞生于1995年。当时，它的主要目的是处理以前由服务器端语言负责的一些输入验证操作。"
  }
};

export default function ReaderPage() {
  const params = useParams();
  const router = useRouter();
  const { format, id } = params;
  const [book, setBook] = useState<Book | BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  useEffect(() => {
    // 从API或本地存储获取书籍
    const fetchBook = async () => {
      try {
        setLoading(true);
        // 先尝试从本地存储加载导入的书籍
        if (id && typeof id === 'string' && id.startsWith('local_')) {
          const localBook = await loadBookFromLocalStorage(id);
          if (localBook) {
            setBook(localBook);
            setLoading(false);
            return;
          } else {
            setError("找不到指定的书籍，可能已被删除");
            setLoading(false);
            return;
          }
        }
        
        // 然后尝试从模拟数据加载
        await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟
        
        if (id && typeof id === 'string' && mockBooks[id as keyof typeof mockBooks]) {
          setBook(mockBooks[id as keyof typeof mockBooks]);
        } else {
          setError("找不到指定的书籍");
        }
      } catch (err) {
        console.error("加载书籍时出错:", err);
        setError("加载书籍时出错");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBook();
  }, [id]);
  
  // 更新阅读进度
  const handleLocationChange = useCallback((location: string | number) => {
    if (book && 'id' in book) {
      // 这里可以添加保存进度的逻辑
      console.log(`更新阅读进度: ${book.id}, 位置: ${location}`);
    }
  }, [book]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error || !book) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-xl font-bold mb-2">出错了</h2>
        <p className="text-center text-gray-600 dark:text-gray-400">{error || "找不到指定的书籍"}</p>
      </div>
    );
  }
  
  // 根据格式渲染不同的阅读器组件
  const renderReader = () => {
    // 确保content是字符串
    let contentStr: string;
    
    if (typeof book.content === 'string') {
      contentStr = book.content;
    } else if (book.content instanceof ArrayBuffer) {
      // 处理二进制数据，临时转为文本显示
      const decoder = new TextDecoder('utf-8');
      try {
        contentStr = decoder.decode(book.content);
      } catch (err) {
        contentStr = '此二进制内容无法直接显示';
      }
    } else {
      contentStr = '不支持的内容格式';
    }
      
    switch (format) {
      case 'txt':
        return (
          <TxtReader 
            content={contentStr} 
            onLocationChange={handleLocationChange}
          />
        );
      case 'epub':
        return (
          <EpubReader 
            content={contentStr}
            onLocationChange={handleLocationChange}
          />
        );
      case 'pdf':
        // 临时使用TXT阅读器渲染PDF内容
        return (
          <TxtReader 
            content={contentStr}
            onLocationChange={handleLocationChange}
          />
        );
      case 'md':
        // 临时使用TXT阅读器渲染Markdown内容
        return (
          <TxtReader 
            content={contentStr}
            onLocationChange={handleLocationChange}
          />
        );
      default:
        return <BaseReader />;
    }
  };
  
  return (
    <div className="h-screen overflow-hidden">
      {/* 阅读器内容 */}
      {renderReader()}
      
      {/* 设置按钮 */}
      <button
        className="fixed top-2 right-2 p-2 rounded-full bg-white/70 dark:bg-gray-800/70 shadow-md z-50"
        onClick={() => setShowSettings(!showSettings)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
      
      {/* 返回按钮 */}
      <button
        className="fixed top-2 left-2 p-2 rounded-full bg-white/70 dark:bg-gray-800/70 shadow-md z-50"
        onClick={() => router.push('/library')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  );
} 