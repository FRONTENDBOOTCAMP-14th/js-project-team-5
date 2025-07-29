import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js, prettier: prettierPlugin },
    extends: ['js/recommended', prettier],
    languageOptions: { globals: globals.browser },
    rules: {
      'prettier/prettier': 'warn', // Prettier 포맷팅 오류를 ESLint 에러로 표시
    },
    ignores: ['**/dist/**'],
  },
]);
