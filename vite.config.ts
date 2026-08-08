import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    // Caminho base usado pelo GitHub Pages
    base: '/treinohiit/',

    plugins: [
      react(),
      tailwindcss(),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    server: {
      // HMR pode ser desativado pelo AI Studio através da variável DISABLE_HMR
      hmr: process.env.DISABLE_HMR !== 'true',

      // Desativa o file watching quando DISABLE_HMR estiver ativo
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
