import path from 'path';
import { defineConfig } from 'vite'; // Removed loadEnv import
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Read the API key directly from the environment variables set by GitHub Actions
    const geminiApiKey = process.env.GEMINI_API_KEY;

    // Optional: Add a check to ensure the key is present during build
    if (!geminiApiKey && mode !== 'development') {
      console.error("Build failed: GEMINI_API_KEY environment variable is not set!");
      // Make the build fail explicitly if the key is missing
      process.exit(1);
    }

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Use the key read directly from process.env
        'process.env.API_KEY': JSON.stringify(geminiApiKey || ""),
        'process.env.GEMINI_API_KEY': JSON.stringify(geminiApiKey || "")
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
