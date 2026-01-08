
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8001,
    proxy: {
      "/api": {
        target: "https://staging.chokhizameen.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
        // Removed rewrite rule to preserve /api prefix
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));