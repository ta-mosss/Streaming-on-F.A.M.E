import { defineConfig } from 'vite';
export default defineConfig({ base: '/', publicDir: 'public', build: { target: 'es2022', sourcemap: true, assetsDir: 'assets', cssCodeSplit: true } });
