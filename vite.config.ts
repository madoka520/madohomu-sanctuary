import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { fileURLToPath, URL } from "node:url";
import AutoImport from "unplugin-auto-import/vite";
import VueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      script: {
        propsDestructure: true,
      },
    }),
    vueJsx(),
    AutoImport({
      imports: ["vue", "vue-router", "@vueuse/core", "vue/macros"],
      dts: "auto-imports.d.ts",
      dirs: ["src/utils/global"],
      resolvers: [],
    }),
    VueDevTools(),
  ],
  base: "",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
