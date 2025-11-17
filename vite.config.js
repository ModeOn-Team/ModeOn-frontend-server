// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      // 일반 API: /api/membership → http://localhost:8080/api/membership
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },

      // 관리자 API: /api/ModeOn_1101 → http://localhost:8080/api/ModeOn_1101
      [process.env.VITE_ADMIN_API_URL || "/api/ModeOn_1101"]: {
        target: process.env.VITE_API_URL || "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
