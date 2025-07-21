import { defineConfig } from 'vite';
import path from 'path';
import { findAllHtmlFiles } from './src/scripts/customLib.js';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        ...vitelib.findAllHtmlFiles(path.resolve(__dirname, 'src')),
      },
    },
  },
  appType: 'mpa', // fallback 사용안함
  server: {
    // open: 'src/pages/main/index.html', // 서버 시작 시 브라우저에서 지정페이지 자동으로 열기
  },
});
