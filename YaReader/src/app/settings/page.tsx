"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const [theme, setTheme] = useState("system");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("sans");
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold">设置</h1>
        </div>
      </header>
      
      <main className="flex-grow p-4 container max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-medium mb-4">外观</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">主题</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  className={`p-4 rounded-lg border ${theme === 'light' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                  onClick={() => setTheme('light')}
                >
                  <div className="h-12 bg-white rounded mb-2 border border-gray-200"></div>
                  <span className="text-sm">浅色</span>
                </button>
                <button
                  className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                  onClick={() => setTheme('dark')}
                >
                  <div className="h-12 bg-gray-900 rounded mb-2 border border-gray-700"></div>
                  <span className="text-sm">深色</span>
                </button>
                <button
                  className={`p-4 rounded-lg border ${theme === 'system' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                  onClick={() => setTheme('system')}
                >
                  <div className="h-12 bg-gradient-to-r from-white to-gray-900 rounded mb-2 border border-gray-200"></div>
                  <span className="text-sm">跟随系统</span>
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">字体大小 ({fontSize}px)</label>
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>小</span>
                <span>大</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">字体</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className={`p-3 rounded-lg border ${fontFamily === 'sans' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                  onClick={() => setFontFamily('sans')}
                >
                  <span className="font-sans">无衬线字体 Aa</span>
                </button>
                <button
                  className={`p-3 rounded-lg border ${fontFamily === 'serif' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                  onClick={() => setFontFamily('serif')}
                >
                  <span className="font-serif">衬线字体 Aa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-medium mb-4">存储</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">本地存储</h3>
                <p className="text-sm text-gray-500">管理本地缓存的书籍文件</p>
              </div>
              <Button variant="secondary" size="sm">管理</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">清除缓存</h3>
                <p className="text-sm text-gray-500">清除应用缓存数据</p>
              </div>
              <Button variant="secondary" size="sm">清除</Button>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-medium mb-4">关于</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">YaReader</h3>
              <p className="text-sm text-gray-500">版本 0.1.0</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">检查更新</h3>
                <p className="text-sm text-gray-500">当前为最新版本</p>
              </div>
              <Button variant="secondary" size="sm">检查</Button>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 text-center">
                © 2023 YaReader · 基于浏览器的开源阅读器
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 