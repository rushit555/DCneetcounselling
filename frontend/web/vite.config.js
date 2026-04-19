import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  envDir: '../../',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        thankyou: 'thank-you/index.html',
        reset: 'reset-password/index.html'
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
});
