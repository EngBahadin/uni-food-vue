import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/uni-food-vue/' : '/',
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~types': fileURLToPath(new URL('./types', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    proxy: {
      // Proxy API requests to backend during development to avoid CORS issues
      '/api': {
        target: 'http://localhost:8000/',
        changeOrigin: true,
        secure: false,
      },
      // Proxy all auth API requests to backend (only API endpoints, not frontend routes)
      '^/auth/(users|jwt)': {
        target: 'http://localhost:8000/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // Keep the path as is
      },
      // Proxy media files from backend (images, etc.)
      '/media': {
        target: 'http://localhost:8000/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
