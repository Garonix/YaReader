"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-6">YaReader</h1>
      <p className="text-lg mb-8 max-w-md">
        高性能浏览器阅读器，支持多种格式，专为移动设备优化
      </p>
      
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button asChild size="lg" fullWidth>
          <Link href="/library">打开书库</Link>
        </Button>
        
        <Button variant="outline" asChild size="lg" fullWidth>
          <Link href="/settings">设置</Link>
        </Button>
      </div>
      
      <div className="mt-12">
        <p className="text-sm text-gray-500">
          版本 0.1.0 - 基于 Next.js 构建
        </p>
      </div>
    </div>
  );
} 