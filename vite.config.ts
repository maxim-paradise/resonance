import { defineConfig, type Plugin } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';

// Dev-only: map clean URL /privacy to privacy/index.html
// (otherwise Vite's SPA fallback serves the root index.html).
function cleanPrivacyUrl(): Plugin {
  return {
    name: 'clean-privacy-url',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === '/privacy' || req.url === '/privacy?') {
          req.url = '/privacy/index.html';
        }
        next();
      });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), cleanPrivacyUrl()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        privacy: 'privacy/index.html',
      },
    },
  },
});
