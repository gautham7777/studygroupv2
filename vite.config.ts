import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; // <-- IMPORT THIS

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()], // <-- ADD THIS
      define: {
        'process.env.API_KEY': JSON.stringify(env.AIzaSyD4wEFlkdN2ClFQwc0JAQkvZ85tOx2RvTs),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.AIzaSyD4wEFlkdN2ClFQwc0JAQkvZ85tOx2RvTs)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
