import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import AutoImport from "unplugin-auto-import/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      script: {
        propsDestructure: true,
      },
    }),
    AutoImport({
      imports: ["vue", "vue-router", "@vueuse/core", "vue/macros"],
      dts: "auto-imports.d.ts",
      dirs: ["src/utils/global"],
      resolvers: [],
    }),
  ],
  base: "",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
