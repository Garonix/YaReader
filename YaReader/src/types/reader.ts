import { BookFormat } from './book';

/**
 * 阅读模式
 */
export enum ReadingMode {
  SCROLL = 'scroll', // 垂直滚动
  PAGINATED = 'paginated', // 分页
  CONTINUOUS = 'continuous', // 连续
  SPREAD = 'spread', // 双页
}

/**
 * 主题模式
 */
export enum ThemeMode {
  LIGHT = 'light', // 亮色模式
  DARK = 'dark', // 深色模式
  SEPIA = 'sepia', // 护眼模式
  CUSTOM = 'custom', // 自定义
}

/**
 * 字体设置
 */
export interface FontSettings {
  fontFamily: string;
  fontSize: number; // px
  lineHeight: number; // 行高倍数
  letterSpacing: number; // px
  textAlign: 'left' | 'center' | 'right' | 'justify';
}

/**
 * 页面设置
 */
export interface PageSettings {
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  columns: number; // 列数
  gap: number; // 列间距
}

/**
 * 阅读器设置
 */
export interface ReaderSettings {
  mode: ReadingMode;
  theme: ThemeMode;
  font: FontSettings;
  page: PageSettings;
  showPageNumber: boolean;
  showProgress: boolean;
  showTime: boolean;
  showBattery: boolean;
  showChapter: boolean;
  lockOrientation: boolean;
  preventSleep: boolean;
  fullscreen: boolean;
  customCSS?: string;
}

/**
 * 阅读器状态
 */
export interface ReaderState {
  bookId: string | null;
  format: BookFormat | null;
  isLoading: boolean;
  error: string | null;
  currentLocation: string | null;
  currentPage: number | null;
  totalPages: number | null;
  progress: number; // 0-1
  toc: TocItem[] | null;
  isControlsVisible: boolean;
  settings: ReaderSettings;
}

/**
 * 目录项
 */
export interface TocItem {
  id: string;
  label: string;
  href: string;
  level: number;
  children?: TocItem[];
}

/**
 * 阅读器配置
 */
export interface ReaderConfig {
  defaultSettings: ReaderSettings;
  formatSpecificSettings: Partial<Record<BookFormat, Partial<ReaderSettings>>>;
  bookSpecificSettings: Record<string, Partial<ReaderSettings>>;
}

/**
 * 阅读事件类型
 */
export enum ReadingEventType {
  OPEN = 'open',
  CLOSE = 'close',
  NAVIGATE = 'navigate',
  BOOKMARK = 'bookmark',
  HIGHLIGHT = 'highlight',
  SETTINGS_CHANGE = 'settings_change',
}

/**
 * 阅读事件
 */
export interface ReadingEvent {
  type: ReadingEventType;
  bookId: string;
  timestamp: string;
  location?: string;
  page?: number;
  duration?: number; // 持续时间（秒）
  data?: any;
} 