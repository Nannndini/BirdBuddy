import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/inat": {
        target: "https://api.inaturalist.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/inat/, "")
      }
    }
  },
  build: { sourcemap: true }
});
