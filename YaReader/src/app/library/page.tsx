"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

// 模拟书籍数据
const mockBooks = [
  {
    id: "1",
    title: "三体",
    author: "刘慈欣",
    format: "epub",
    cover: null,
    lastRead: new Date(Date.now() - 3600000).toISOString(),
    progress: 0.45,
  },
  {
    id: "2",
    title: "活着",
    author: "余华",
    format: "epub",
    cover: null,
    lastRead: new Date(Date.now() - 86400000).toISOString(),
    progress: 0.72,
  },
  {
    id: "3",
    title: "JavaScript高级程序设计",
    author: "Nicholas C. Zakas",
    format: "pdf",
    cover: null,
    lastRead: new Date(Date.now() - 7 * 86400000).toISOString(),
    progress: 0.15,
  }
];

export default function LibraryPage() {
  const [books, setBooks] = useState(mockBooks);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">我的书库</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
              aria-label="网格视图"
              className={viewMode === "grid" ? "bg-gray-100 dark:bg-gray-800" : ""}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              aria-label="列表视图"
              className={viewMode === "list" ? "bg-gray-100 dark:bg-gray-800" : ""}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow p-4 container max-w-4xl mx-auto">
        {books.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 gap-4" : "space-y-4"}>
            {books.map(book => (
              <Link 
                key={book.id} 
                href={`/reader/${book.format}/${book.id}`}
                className={`
                  block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow
                  ${viewMode === "list" ? "flex items-center p-3" : ""}
                `}
              >
                <div className={`
                  ${viewMode === "grid" ? "aspect-[2/3] relative" : "w-16 h-20 flex-shrink-0 mr-4"}
                  bg-gray-200 dark:bg-gray-700
                  flex items-center justify-center
                `}>
                  {/* 如果没有封面图就显示格式 */}
                  <span className="text-xs uppercase text-gray-500 dark:text-gray-400">{book.format}</span>
                </div>
                
                <div className={viewMode === "grid" ? "p-3" : ""}>
                  <h3 className="font-medium text-sm line-clamp-2">{book.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{book.author}</p>
                  
                  <div className="mt-2 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded">
                    <div
                      className="h-full bg-primary-600 rounded"
                      style={{ width: `${book.progress * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {Math.round(book.progress * 100)}% 完成
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              你的书库中还没有书籍
            </p>
            <Button asChild>
              <Link href="/import">添加图书</Link>
            </Button>
          </div>
        )}
      </main>
      
      <div className="fixed right-6 bottom-6">
        <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Button>
      </div>
    </div>
  );
} 