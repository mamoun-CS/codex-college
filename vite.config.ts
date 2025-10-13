import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for ngrok compatibility
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          table: ['@tanstack/react-table'],
          icons: ['lucide-react']
        }
      }
    }
  },
  server: {
    host: '0.0.0.0', // Allow connections from any host (important for ngrok)
    port: 5173,
    strictPort: false,
    allowedHosts: [
      'fitting-singularly-heron.ngrok-free.app',
      'localhost',
      '127.0.0.1',
      '0.0.0.0'
    ],
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: false,
    allowedHosts: [
      'fitting-singularly-heron.ngrok-free.app',
      '2e9685a1d54d.ngrok-free.app',
      'localhost','82.25.115.245',
      'srv936449.hstgr.cloud',
      '127.0.0.1',
      '10.229.120.84',
      '0.0.0.0'
    ],
  }
})
