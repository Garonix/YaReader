import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { format: string } }
) {
  const { format } = params;
  
  try {
    let filePath: string;
    let contentType: string;
    
    // 根据请求的格式确定文件路径和内容类型
    switch (format) {
      case 'txt':
        filePath = path.join(process.cwd(), 'test_books', '剑来.txt');
        contentType = 'text/plain; charset=utf-8';
        break;
      case 'epub':
        filePath = path.join(process.cwd(), 'test_books', '怪谈研究室 (【日】三津田信三) (Z-Library).epub');
        contentType = 'application/epub+zip';
        break;
      default:
        return NextResponse.json(
          { error: `不支持的格式: ${format}` },
          { status: 400 }
        );
    }
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      console.error(`文件不存在: ${filePath}`);
      return NextResponse.json(
        { error: '文件不存在' },
        { status: 404 }
      );
    }
    
    // 读取文件
    const fileBuffer = fs.readFileSync(filePath);
    
    // 返回文件内容
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${path.basename(filePath)}"`,
      },
    });
    
  } catch (error: any) {
    console.error('API路由错误:', error);
    return NextResponse.json(
      { error: error.message || '服务器内部错误' },
      { status: 500 }
    );
  }
} 