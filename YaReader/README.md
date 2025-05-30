# YaReader

YaReader 是一个基于浏览器的文档阅读器，专为移动端阅读体验优化设计，提供流畅、高效的电子书阅读功能。

## 特性

- 📚 支持多种文档格式（EPUB, PDF, Markdown, TXT等）
- 📱 专为移动浏览器优化的阅读体验
- 🔄 SMB网络存储直接访问
- 🌙 舒适的日间/夜间阅读模式
- 📖 流畅的翻页效果与手势控制
- 🔖 书签与阅读进度记录
- 📝 文本批注与高亮
- 🔍 全文搜索功能
- 📊 阅读统计
- 🌐 离线阅读支持 (PWA)

## 快速开始

### 安装依赖

```bash
# 安装项目依赖
npm install
# 或使用 yarn
yarn install
```

### 开发模式

```bash
npm run dev
# 或使用 yarn
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm run start
# 或使用 yarn
yarn build
yarn start
```

## 部署

### Vercel 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2FYaReader)

### Docker 部署

```bash
# 构建 Docker 镜像
docker build -t yareader .

# 运行容器
docker run -p 3000:3000 yareader
```

## 技术栈

- 前端框架: Next.js + React 18 + TypeScript
- UI组件: Tailwind CSS + Headless UI
- 文档处理: epub.js, PDF.js, react-markdown
- 状态管理: Zustand + React Query
- 存储: IndexedDB, localForage
- 网络: Axios, SWR

## 项目结构

项目采用模块化架构，详细结构见 [项目架构文档](./docs/项目架构.md)。

## 贡献

欢迎提交 Pull Request 或提出 Issue！

### 开发指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 联系方式

- 项目链接: [https://github.com/your-username/YaReader](https://github.com/your-username/YaReader)
- 问题反馈: [https://github.com/your-username/YaReader/issues](https://github.com/your-username/YaReader/issues) 