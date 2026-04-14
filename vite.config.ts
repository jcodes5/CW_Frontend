import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
    allowedHosts: ['1927-102-89-83-236.ngrok-free.app', 'a6dd-2605-59c0-e20-3408-497a-c605-c224-fca.ngrok-free.app', 'cc3c-135-129-124-116.ngrok-free.app'],
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
