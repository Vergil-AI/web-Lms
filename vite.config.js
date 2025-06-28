// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  root: "frontend",
  build: {
    outDir: "../assets/dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        pengenalan: "frontend/js/pengenalan.js"
      }
    }
  }
});
