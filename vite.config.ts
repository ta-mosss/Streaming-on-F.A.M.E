import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Streaming-on-F.A.M.E/',
  publicDir: 'public',
  build: {
    target: 'es2022',
    sourcemap: true,
    assetsDir: 'assets',
    cssCodeSplit: true,
    reportCompressedSize: true
  }
});