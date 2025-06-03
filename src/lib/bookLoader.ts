import { BooksDatabase } from './database';

/**
 * 获取文件扩展名
 */
function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

const db = new BooksDatabase();

export interface BookData {
  id: string;
  title: string;
  author?: string;
  format: string;
  content: string | ArrayBuffer;
  cover?: string | null;
  lastRead?: string;
  progress?: number;
}

/**
 * 根据文件路径加载书籍
 */
export async function loadBookFromFile(file: File): Promise<BookData> {
  // 检查文件格式
  const format = getFileExtension(file.name);
  const validFormats = ['txt', 'epub', 'pdf', 'md'];
  
  if (!validFormats.includes(format)) {
    throw new Error(`不支持的文件格式: ${format}`);
  }
  
  // 根据不同格式加载内容
  let content: string | ArrayBuffer;
  
  try {
    if (format === 'txt' || format === 'md') {
      content = await file.text();
    } else {
      content = await file.arrayBuffer();
    }
    
    // 创建书籍数据
    const bookData: BookData = {
      id: `local_${Date.now()}`,
      title: file.name.replace(`.${format}`, ''),
      format,
      content,
      cover: null,
      lastRead: new Date().toISOString(),
      progress: 0
    };
    
    return bookData;
  } catch (error) {
    console.error('加载书籍失败:', error);
    throw new Error('无法加载书籍文件');
  }
}

/**
 * 保存书籍到本地存储
 */
export async function saveBookToLocalStorage(book: BookData): Promise<void> {
  try {
    // 只存储书籍元数据到localStorage
    const metadata = {
      id: book.id,
      title: book.title,
      author: book.author,
      format: book.format,
      cover: book.cover,
      lastRead: book.lastRead,
      progress: book.progress,
      size: typeof book.content === 'string' 
        ? book.content.length 
        : book.content.byteLength
    };
    
    // 保存元数据到localStorage
    localStorage.setItem(`book_${book.id}_meta`, JSON.stringify(metadata));
    
    // 保存内容到IndexedDB
    await db.put({
      id: book.id,
      content: book.content
    });

  } catch (error) {
    console.error('保存书籍失败:', error);
    throw new Error('无法保存书籍到本地存储');
  }
}

/**
 * 从本地存储加载书籍
 */
export async function loadBookFromLocalStorage(id: string): Promise<BookData | null> {
  try {
    // 加载元数据
    const metaJson = localStorage.getItem(`book_${id}_meta`);
    if (!metaJson) return null;
    
    const metadata = JSON.parse(metaJson);
    
    // 从IndexedDB加载内容
    const bookContent = await db.get(id);
    if (!bookContent) return null;
    
    return {
      ...metadata,
      content: bookContent.content
    };
  } catch (error) {
    console.error('从本地存储加载书籍失败:', error);
    return null;
  }
} 