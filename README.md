# YaReader - 浏览器电子书阅读器

YaReader是一个基于浏览器的电子书阅读器，支持多种电子书格式（TXT、EPUB、PDF、Markdown），专为移动设备优化，提供流畅的阅读体验。

## 特性

- 支持多种电子书格式：TXT、EPUB、PDF、Markdown
- 响应式设计，适配桌面和移动设备
- 深色模式支持
- 自定义阅读设置（字体、大小、行距等）
- 本地存储书籍和阅读进度
- 支持SMB网络存储直接读取

## 技术栈

- **前端框架**：Next.js 14、React 18
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **状态管理**：React Context API
- **数据存储**：IndexedDB、LocalStorage

## 项目结构

```
YaReader/
├── public/          # 静态资源
├── src/
│   ├── api/         # API接口
│   ├── app/         # Next.js页面组件
│   ├── components/  # React组件
│   │   ├── reader/  # 阅读器组件
│   │   └── ui/      # UI组件
│   ├── lib/         # 工具函数
│   ├── types/       # TypeScript类型定义
│   └── utils/       # 辅助工具
├── test/            # 测试文件
└── test_books/      # 测试用电子书
```

## 开发

### 环境要求

- Node.js 18+
- npm 9+

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
./start-dev.sh
# 或
npm run dev
```

### 测试

项目包含测试文件夹，用于测试阅读器功能：

```bash
# 命令行测试
node test/test_reader.js

# 浏览器测试
# 访问 http://localhost:3000/test
```

详细的测试说明请参考 [test/README.md](test/README.md)。

## 测试文件

项目包含以下测试文件：

- `test_books/剑来.txt`: 10MB 的 TXT 文件
- `test_books/怪谈研究室.epub`: 2.1MB 的 EPUB 文件

这些文件用于测试阅读器处理大文件的性能。

## 性能优化

为了处理大文件，我们实施了以下优化：

1. **异步分页处理**：使用 `requestAnimationFrame` 分批处理文本内容
2. **进度显示**：添加进度条，显示文本处理进度
3. **内存优化**：使用 IndexedDB 存储书籍内容，减少内存占用

## 许可证

MIT 