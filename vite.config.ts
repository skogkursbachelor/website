import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://gts.nve.no",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/skogsbilveg": {
        target: "http://localhost:8080/api/v1/forestryroads",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/skogsbilveg/, ""),
      },
    },
  },
});
