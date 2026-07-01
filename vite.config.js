import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this app under /restaurant-demo/, Vercel serves it at the domain root.
  base: process.env.VERCEL ? '/' : '/restaurant-demo/',
})
