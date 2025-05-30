import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并多个类名，处理tailwind冲突
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 判断是否为移动设备
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 安全地解析JSON字符串
 */
export function safeParseJSON<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    return fallback;
  }
}

/**
 * 延迟函数
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 获取文件扩展名
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * 格式化时间（时:分:秒）
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

/**
 * 格式化日期
 */
export function formatDate(date: string | Date, locale: string = 'zh-CN'): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // 如果是今天
  const today = new Date();
  if (d.toDateString() === today.toDateString()) {
    return '今天 ' + d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  }
  
  // 如果是昨天
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) {
    return '昨天 ' + d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  }
  
  // 如果是今年
  if (d.getFullYear() === today.getFullYear()) {
    return d.toLocaleDateString(locale, { month: 'short', day: 'numeric' }) + ' ' + 
           d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  }
  
  // 其他情况
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * 根据文件名判断文件类型
 */
export function getFileType(filename: string): string {
  const ext = getFileExtension(filename);
  
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const docExts = ['doc', 'docx', 'pdf', 'txt', 'md', 'epub', 'mobi'];
  const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz'];
  const videoExts = ['mp4', 'webm', 'mkv', 'avi', 'mov'];
  const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'm4a'];
  
  if (imageExts.includes(ext)) return 'image';
  if (docExts.includes(ext)) return 'document';
  if (archiveExts.includes(ext)) return 'archive';
  if (videoExts.includes(ext)) return 'video';
  if (audioExts.includes(ext)) return 'audio';
  
  return 'unknown';
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
} 