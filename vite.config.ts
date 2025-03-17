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
        target: "https://wms.geonorge.no/skwms1/wms.traktorveg_skogsbilveger",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/skogsbilveg/, ""),
      },
    },
  },
});
