import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd(), '');

  return {
    /**
     * GitHub Pages 배포 설정
     * 배포 시: '/저장소이름/' (예: '/my-app/')
     * 로컬 개발 시: '/'
     */
    base: mode === 'production' ? '/Project0001/' : '/',

    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    plugins: [react()],

    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        // 기존 '.'에서 './src'로 변경하여 더 효율적인 경로 관리 가능
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
