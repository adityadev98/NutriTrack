import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  //const env = loadEnv(mode, process.cwd() + "/..", "VITE_");
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    plugins: [
      react(),
      tailwindcss(),
      tsconfigPaths()
    ],
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:5000",
        },
      },
    },
    define: {
      'import.meta.env.VITE_NUTRITIONIX_APP_ID': JSON.stringify(env.VITE_NUTRITIONIX_APP_ID),
      'import.meta.env.VITE_NUTRITIONIX_API_KEY': JSON.stringify(env.VITE_NUTRITIONIX_API_KEY),
    },
  }
});
