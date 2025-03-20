import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd() + "/..", "VITE_");
  return {
    plugins: [
      react(),
      tailwindcss(),
      tsconfigPaths()
    ],
    server: {
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
        "Cross-Origin-Embedder-Policy": "credentialless",
      },
      proxy: {
        "/api": {
          target: `http://localhost:${env.VITE_PORT || 5000}`,
          changeOrigin: true,
        },
      },
      watch: {
        usePolling: true
    }
    },
    define: {
      'import.meta.env.VITE_NUTRITIONIX_APP_ID': JSON.stringify(env.VITE_NUTRITIONIX_APP_ID),
      'import.meta.env.VITE_NUTRITIONIX_API_KEY': JSON.stringify(env.VITE_NUTRITIONIX_API_KEY),
      'import.meta.env.VITE_PORT': JSON.stringify(env.VITE_PORT),
      'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(env.VITE_GOOGLE_CLIENT_ID),
    },
  }
});
