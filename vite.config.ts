import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split CodeMirror into its own chunk for lazy loading
          'codemirror': [
            '@codemirror/state',
            '@codemirror/lang-javascript',
            '@codemirror/lang-python',
            '@codemirror/lang-java',
            '@codemirror/lang-cpp',
            '@codemirror/lang-rust',
            '@codemirror/lang-go',
            '@uiw/react-codemirror',
            '@uiw/codemirror-theme-github',
          ],
          // Split React vendor code
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Split UI libraries
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-alert-dialog', '@radix-ui/react-label', '@radix-ui/react-slot'],
        },
      },
    },
  },
})
