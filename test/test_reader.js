// 测试阅读器加载测试文件夹中的文件
const fs = require('fs');
const path = require('path');

// 测试文件路径
const TEST_BOOKS_DIR = path.join(__dirname, '../test_books');
const TXT_BOOK_PATH = path.join(TEST_BOOKS_DIR, '剑来.txt');
const EPUB_BOOK_PATH = path.join(TEST_BOOKS_DIR, '怪谈研究室 (【日】三津田信三) (Z-Library).epub');

// 测试文件是否存在
console.log('测试文件检查:');
console.log(`- TXT文件(剑来.txt): ${fs.existsSync(TXT_BOOK_PATH) ? '存在' : '不存在'}`);
console.log(`- EPUB文件(怪谈研究室.epub): ${fs.existsSync(EPUB_BOOK_PATH) ? '存在' : '不存在'}`);

// 获取文件大小
const getTxtFileSize = () => {
  try {
    const stats = fs.statSync(TXT_BOOK_PATH);
    return stats.size;
  } catch (error) {
    return -1;
  }
};

const getEpubFileSize = () => {
  try {
    const stats = fs.statSync(EPUB_BOOK_PATH);
    return stats.size;
  } catch (error) {
    return -1;
  }
};

console.log(`\nTXT文件大小: ${(getTxtFileSize() / (1024 * 1024)).toFixed(2)}MB`);
console.log(`EPUB文件大小: ${(getEpubFileSize() / (1024 * 1024)).toFixed(2)}MB`);

// 测试读取TXT文件内容的前1000个字符
const testReadTxtContent = () => {
  try {
    console.log('\n测试读取TXT文件内容:');
    const content = fs.readFileSync(TXT_BOOK_PATH, 'utf8');
    console.log('成功读取TXT文件');
    console.log('内容预览(前100个字符):');
    console.log(content.substring(0, 100) + '...');
    return true;
  } catch (error) {
    console.error('读取TXT文件失败:', error.message);
    return false;
  }
};

// 测试读取EPUB文件的二进制内容
const testReadEpubContent = () => {
  try {
    console.log('\n测试读取EPUB文件内容:');
    const content = fs.readFileSync(EPUB_BOOK_PATH);
    console.log('成功读取EPUB文件');
    console.log(`读取了${content.length}字节的数据`);
    return true;
  } catch (error) {
    console.error('读取EPUB文件失败:', error.message);
    return false;
  }
};

// 运行测试
testReadTxtContent();
testReadEpubContent();

console.log('\n测试完成'); 