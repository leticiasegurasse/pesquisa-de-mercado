import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  build: {
    // Forçar rebuild completo
    emptyOutDir: true,
    // Otimizações para produção
    minify: 'terser',
    sourcemap: false,
    // Configurações de rollup
    rollupOptions: {
      output: {
        // Nomes de arquivos com hash para cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  // Configurações de servidor para desenvolvimento
  server: {
    port: 5173,
    host: true
  },
  // Configurações de preview
  preview: {
    port: 4173,
    host: true
  }
})
