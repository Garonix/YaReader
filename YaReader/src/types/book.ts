/**
 * 书籍格式枚举
 */
export enum BookFormat {
  EPUB = 'epub',
  PDF = 'pdf',
  TXT = 'txt',
  MD = 'md',
  MOBI = 'mobi',
  AZW3 = 'azw3',
  DJVU = 'djvu',
  CBZ = 'cbz',
  CBR = 'cbr',
  UNKNOWN = 'unknown'
}

/**
 * 书籍元数据
 */
export interface BookMetadata {
  title: string;
  author?: string;
  publisher?: string;
  description?: string;
  language?: string;
  isbn?: string;
  publishDate?: string;
  cover?: string;
  categories?: string[];
  tags?: string[];
}

/**
 * 书籍阅读进度
 */
export interface BookProgress {
  currentLocation: string; // 当前阅读位置标识（依格式而定）
  currentPage?: number;
  totalPages?: number;
  percentage: number; // 0-1之间的小数
  lastRead: string; // ISO日期字符串
  totalReadTime?: number; // 总阅读时间（秒）
}

/**
 * 书籍标记
 */
export interface BookMark {
  id: string;
  location: string; // 位置标识
  text?: string;
  note?: string;
  color?: string;
  createdAt: string; // ISO日期字符串
  updatedAt: string; // ISO日期字符串
}

/**
 * 书籍源类型
 */
export enum BookSourceType {
  LOCAL = 'local',
  SMB = 'smb',
  WEBDAV = 'webdav',
  CALIBRE = 'calibre',
  OPDS = 'opds'
}

/**
 * 书籍源信息
 */
export interface BookSource {
  type: BookSourceType;
  path: string;
  lastSync?: string;
  available?: boolean;
}

/**
 * 书籍模型
 */
export interface Book {
  id: string;
  format: BookFormat;
  filename: string;
  filesize: number;
  hash?: string;
  addedAt: string;
  metadata: BookMetadata;
  progress?: BookProgress;
  bookmarks?: BookMark[];
  source: BookSource;
}

/**
 * 书籍简略信息（用于列表展示）
 */
export interface BookSummary {
  id: string;
  title: string;
  author?: string;
  cover?: string;
  format: BookFormat;
  progress?: number;
  lastRead?: string;
}

/**
 * 书籍集合/书架
 */
export interface BookCollection {
  id: string;
  name: string;
  description?: string;
  bookIds: string[];
  createdAt: string;
  updatedAt: string;
  cover?: string;
} 