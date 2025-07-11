// @ts-check

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tsconfigPaths from 'vite-tsconfig-paths';

// @see https://vite.dev/config/
export default defineConfig({
  // Use relative paths
  base: './',

  plugins: [
    // Plugins...
    tailwindcss(),
    react(),
    tsconfigPaths(),
    viteStaticCopy({
      targets: [
        {
          src: 'frame-test.html',
          dest: '',
        },
      ],
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  /* // SCSS Configuration (TODO: To make it work with tailwindcss v.4)
   * css: {
   *   preprocessorOptions: {
   *     scss: {
   *       // quietDeps: true,
   *       api: 'modern-compiler',
   *       silenceDeprecations: ['import', 'global-builtin'],
   *       additionalData: `@import 'tailwindcss/theme' layer(theme); @import 'tailwindcss/utilities' layer(utilities);`,
   *     },
   *   },
   * },
   */

  build: {
    // Place all assets (JS, CSS, images) in the `static` folder
    assetsDir: 'static',
    target: 'es2015',

    rollupOptions: {
      output: {
        // format: 'umd',
        inlineDynamicImports: true,
        // Ensure index.html is at root (default behavior)
        // No need to change entryFileNames or chunkFileNames for index.html
        // Customize chunk and asset file names inside static folder
        chunkFileNames: '[name]-[hash].js',
        entryFileNames: '[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(css)$/.test(name ?? '')) {
            return '[name]-[hash][extname]';
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/.test(name ?? '')) {
            return 'img/[name]-[hash][extname]';
          }
          // default static folder for other assets
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});
