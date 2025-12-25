import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Base path for GitHub Pages deployment
  // Set VITE_BASE_PATH in .env for your repo name, e.g., '/my-repo-name/'
  // For custom domain or root deployment, leave empty or set to '/'
  base: process.env.VITE_BASE_PATH || '/',

  server: {
    port: 3000
    // Note: Proxy removed - now using Supabase directly
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Enable modern SCSS API
        api: 'modern-compiler'
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          editor: ['jquery', 'trumbowyg'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  }
})
