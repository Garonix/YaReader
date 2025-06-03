#!/bin/bash

# 输出彩色文本
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}====================================${NC}"
echo -e "${GREEN}    启动 YaReader 开发环境    ${NC}"
echo -e "${GREEN}====================================${NC}"

# 检查node和npm是否安装
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}未检测到Node.js，请先安装Node.js${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}未检测到npm，请先安装npm${NC}"
    exit 1
fi

# 显示Node.js版本
echo -e "${BLUE}Node.js版本:${NC} $(node -v)"
echo -e "${BLUE}NPM版本:${NC} $(npm -v)"

# 检查依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}正在安装依赖...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}依赖安装失败，请检查错误信息${NC}"
        exit 1
    fi
fi

# 检查测试文件夹
if [ ! -d "test_books" ]; then
    echo -e "${YELLOW}未检测到test_books文件夹，请确保测试文件已放置${NC}"
fi

# 启动开发服务器
echo -e "${GREEN}正在启动开发服务器...${NC}"
echo -e "${BLUE}访问地址: ${NC}http://localhost:3000"
echo -e "${BLUE}测试页面: ${NC}http://localhost:3000/test"
echo -e "${GREEN}====================================${NC}"

# 启动Next.js开发服务器
npm run dev 