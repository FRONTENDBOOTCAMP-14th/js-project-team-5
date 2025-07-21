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
      const key = path.relative(__dirname, filePath).replace('.html', '');
      htmlFiles[key] = filePath;
    }
  }
}
