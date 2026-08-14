import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),  tailwindcss(),],

server: {

    port: 5173,
    host: true,
    allowedHosts:["duplex-slate-kilobyte.ngrok-free.dev"],
    proxy: {
      '/api': {
        target: 'http://localhost:2468:2468',
        changeOrigin: true,
        rewrite: (path) => path, // Keeps /api prefix
      }
    }
  }
})
