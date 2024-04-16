import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import environment from 'vite-plugin-environment';
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    svgr({
      exportAsDefault: true,
    }),
    environment('all'),
    /* Disabled for now due to incompatibility w/ React upgrade */
    // react({
    //   jsxImportSource: '@welldone-software/why-did-you-render',
    // }),
  ],
  envDir: path.resolve(__dirname, 'env'),
  root: path.resolve(__dirname, 'src'),
  build: {
    outDir: path.resolve(__dirname, 'build'),
    emptyOutDir: false,
    sourcemap: true,
    cssCodeSplit: false,
    assetsDir: path.resolve(__dirname, 'build'),
    minify: process.env.NODE_ENV === 'development' ? false : 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: () => 'index',
        chunkFileNames: '[name].js',
        entryFileNames: `[name]-app.js`,
        assetFileNames: '[name].[ext]',
      },
      plugins: [
        optimizeLodashImports(),
        visualizer({
          brotliSize: true,
          filename: './build/stats.html',
          title: 'Shoyu',
        }),
      ],
    },
  },
});
