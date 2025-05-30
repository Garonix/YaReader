"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import TxtReader from "@/components/reader/txt/TxtReader";
import BaseReader from "@/components/reader/BaseReader";

// 模拟书籍数据
const mockBooks = {
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
  const { format, id } = params;
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // 模拟从API获取书籍内容
    const fetchBook = async () => {
      try {
        // 实际应用中，这里会调用API或从本地存储获取书籍
        await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟
        
        if (id && typeof id === 'string' && mockBooks[id as keyof typeof mockBooks]) {
          setBook(mockBooks[id as keyof typeof mockBooks]);
        } else {
          setError("找不到指定的书籍");
        }
      } catch (err) {
        setError("加载书籍时出错");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBook();
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
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
        <p className="text-center text-gray-600 dark:text-gray-400">{error || "无法加载书籍"}</p>
      </div>
    );
  }
  
  // 根据格式渲染不同的阅读器组件
  const renderReader = () => {
    switch (format) {
      case 'txt':
        return <TxtReader content={book.content} />;
      case 'epub':
        // 临时使用TXT阅读器渲染EPUB内容
        return <TxtReader content={book.content} />;
      case 'pdf':
        // 临时使用TXT阅读器渲染PDF内容
        return <TxtReader content={book.content} />;
      case 'md':
        // 临时使用TXT阅读器渲染Markdown内容
        return <TxtReader content={book.content} />;
      default:
        return <BaseReader />;
    }
  };
  
  return (
    <div className="h-screen overflow-hidden">
      {renderReader()}
    </div>
  );
} 