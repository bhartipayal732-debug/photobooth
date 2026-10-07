import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In dev, forward API + photo requests to the Express server.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: { '/api': 'http://localhost:3001', '/photos': 'http://localhost:3001' },
  },
});
