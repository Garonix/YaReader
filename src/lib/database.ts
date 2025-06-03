/**
 * 书籍数据库
 * 使用IndexedDB存储书籍内容
 */
export class BooksDatabase {
  private readonly DB_NAME = 'YaReaderDB';
  private readonly DB_VERSION = 1;
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDatabase();
  }

  /**
   * 初始化数据库
   */
  private initDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      // 检查浏览器是否支持IndexedDB
      if (!('indexedDB' in window)) {
        reject(new Error('您的浏览器不支持IndexedDB，无法保存书籍内容'));
        return;
      }

      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = (event) => {
        console.error('打开数据库失败:', event);
        reject(new Error('无法打开数据库'));
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 创建书籍内容存储
        if (!db.objectStoreNames.contains('books')) {
          db.createObjectStore('books', { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * 获取数据库连接
   */
  private async getDB(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db;
    }
    return this.initDatabase();
  }

  /**
   * 存储书籍内容
   */
  async put(book: { id: string; content: string | ArrayBuffer }): Promise<void> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['books'], 'readwrite');
      const store = transaction.objectStore('books');
      
      const request = store.put(book);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = (event) => {
        console.error('存储书籍失败:', event);
        reject(new Error('存储书籍失败'));
      };
    });
  }

  /**
   * 获取书籍内容
   */
  async get(id: string): Promise<{ id: string; content: string | ArrayBuffer } | undefined> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['books'], 'readonly');
      const store = transaction.objectStore('books');
      
      const request = store.get(id);
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = (event) => {
        console.error('获取书籍失败:', event);
        reject(new Error('获取书籍失败'));
      };
    });
  }

  /**
   * 删除书籍内容
   */
  async delete(id: string): Promise<void> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['books'], 'readwrite');
      const store = transaction.objectStore('books');
      
      const request = store.delete(id);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = (event) => {
        console.error('删除书籍失败:', event);
        reject(new Error('删除书籍失败'));
      };
    });
  }

  /**
   * 获取所有书籍ID
   */
  async getAllIds(): Promise<string[]> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['books'], 'readonly');
      const store = transaction.objectStore('books');
      
      const request = store.getAllKeys();
      
      request.onsuccess = () => {
        resolve(request.result as string[]);
      };
      
      request.onerror = (event) => {
        console.error('获取书籍ID失败:', event);
        reject(new Error('获取书籍ID失败'));
      };
    });
  }

  /**
   * 清空数据库
   */
  async clear(): Promise<void> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['books'], 'readwrite');
      const store = transaction.objectStore('books');
      
      const request = store.clear();
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = (event) => {
        console.error('清空数据库失败:', event);
        reject(new Error('清空数据库失败'));
      };
    });
  }
} 