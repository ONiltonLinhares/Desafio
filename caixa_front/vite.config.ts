import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/contas': {
        target: 'http://localhost:8080', // URL do Spring Boot
        changeOrigin: true,
        secure: false,
      },
      '/transacoes': {
        target: 'http://localhost:8080', // Proxy para o endpoint de transações
        changeOrigin: true,
      },
    },
  },
});

