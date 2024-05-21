import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import viteTsconfigPaths from "vite-tsconfig-paths"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import { VitePWA } from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths(),
    nodePolyfills(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Anqa",
        short_name: "Anqa",
        icons: [
          {
            src: "favicon.png",
            sizes: "64x64 32x32 24x24 16x16 192x192 512x512",
            type: "image/png",
          },
        ],
        start_url: ".",
        theme_color: "#0079BF",
        background_color: "#101010",
        display: "standalone",
      },
    }),
  ],
  define: {
    global: "globalThis",
  },
})
