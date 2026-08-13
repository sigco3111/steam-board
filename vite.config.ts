import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// 환경 분기 (P34 패턴):
//   Vercel 빌드: basePath '' (root context)
//   Pages 빌드: basePath '/steam-board/' (subpath)
const isVercel = !!process.env.VERCEL;

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: isVercel ? '' : '/steam-board/',
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.STEAM_API_KEY': JSON.stringify(env.STEAM_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      publicDir: 'public',
      build: {
        target: 'es2020',
        chunkSizeWarningLimit: 2000,
      }
    };
});
