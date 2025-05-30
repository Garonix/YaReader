import { Book, BookCollection, BookFormat, BookMark, BookSummary } from './book';

/**
 * API响应基础接口
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * 排序方向
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * 书籍排序字段
 */
export enum BookSortField {
  TITLE = 'title',
  AUTHOR = 'author',
  ADDED_DATE = 'addedDate',
  LAST_READ = 'lastRead',
  PROGRESS = 'progress',
}

/**
 * 书籍查询参数
 */
export interface BookQueryParams extends PaginationParams {
  search?: string;
  author?: string;
  format?: BookFormat | BookFormat[];
  collection?: string;
  sortBy?: BookSortField;
  sortDirection?: SortDirection;
}

/**
 * SMB连接参数
 */
export interface SmbConnectionParams {
  host: string;
  share: string;
  domain?: string;
  username?: string;
  password?: string;
  port?: number;
  path?: string;
}

/**
 * WebDAV连接参数
 */
export interface WebDAVConnectionParams {
  url: string;
  username?: string;
  password?: string;
  path?: string;
}

/**
 * 文件系统项目类型
 */
export enum FileSystemItemType {
  FILE = 'file',
  DIRECTORY = 'directory',
}

/**
 * 文件系统项目
 */
export interface FileSystemItem {
  name: string;
  path: string;
  type: FileSystemItemType;
  size?: number;
  modified?: string;
  isReadable?: boolean;
  format?: BookFormat;
}

/**
 * 导入选项
 */
export interface ImportOptions {
  addToCollection?: string;
  overwriteExisting?: boolean;
  extractMetadata?: boolean;
  generateCover?: boolean;
}

/**
 * 导入结果
 */
export interface ImportResult {
  success: boolean;
  book?: Book;
  error?: string;
}

/**
 * 批量导入结果
 */
export interface BatchImportResult {
  total: number;
  successful: number;
  failed: number;
  books: Book[];
  errors: Record<string, string>;
} 