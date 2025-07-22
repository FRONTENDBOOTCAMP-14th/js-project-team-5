import fs from 'fs';
import path from 'path';

export function findAllHtmlFiles(directory) {
  const htmlFiles = {};
  scanDirectory(directory, htmlFiles);
  return htmlFiles;
}

function scanDirectory(dir, htmlFiles) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      scanDirectory(filePath, htmlFiles);
    } else if (file.endsWith('.html')) {
      // 기존 코드: const key = path.relative(__dirname, filePath).replace('.html', '');
      // 수정 코드:
      const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/'); // 윈도우 경로 구분자 처리
      const key = relPath
        .replace(/^src\//, '') // src/ 제거
        .replace(/\.html$/, ''); // .html 제거
      htmlFiles[key] = filePath;
    }
  }
}
