import path from 'path';
import { defineConfig } from 'vite';
import environment from 'vite-plugin-environment';

export default defineConfig({
  plugins: [environment('all')],
  envDir: path.resolve(__dirname, 'env'),
  root: path.resolve(__dirname, 'src'),
  build: {
    outDir: path.resolve(__dirname, 'build'),
    emptyOutDir: true,
    sourcemap: false,
    cssCodeSplit: false,
    assetsDir: path.resolve(__dirname, 'build'),
    minify: process.env.NODE_ENV === 'development' ? false : 'esbuild',
    rollupOptions: {
      input: {
        'entry-point': './src/entry-point.ts',
      },
      output: {
        entryFileNames: 'index.js',
      },
    },
  },
});
