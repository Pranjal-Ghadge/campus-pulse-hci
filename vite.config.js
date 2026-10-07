import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 3005,
    strictPort: true,
    open: true,
    proxy: {
      '/api': {
        target: process.env.CAMPUS_PULSE_API_TARGET || 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  }
})
