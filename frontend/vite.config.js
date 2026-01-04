import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      '.ngrok-free.app',
      '.ngrok.io',
      '.trycloudflare.com',
      'localhost'
    ],
    proxy: {
      '/api': {
        target: 'http://backend:5000',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: 'http://backend:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
