import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import AutoImport from "unplugin-auto-import/vite";
import VueDevTools from "vite-plugin-vue-devtools";
import vueJsxVapor from "vue-jsx-vapor/vite"
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue({
        script: {
          propsDestructure: true,
        },
      }),
      vueJsxVapor({
        macros: true,
        interop: true,
      }),
      AutoImport({
        imports: ["vue", "vue-router", "@vueuse/core", "vue/macros"],
        dts: "auto-imports.d.ts",
        dirs: ["src/utils/global"],
        resolvers: [],
      }),
      VueDevTools(),
    ],
    base: "",
    server: {
      mimeTypes: {
        "audio/webm": ["weba"],
      },
      allowedHosts: ["nas.madokami.cn"],
      proxy: {
        "/madoka-api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/madoka-api/, ""),
        },
        "/oss-api": {
          target: env.VITE_OSS_URL,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/oss-api/, ""),
        },
        "/haojiezhe-api": {
          target: "https://haojiezhe12345.top:82",
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/haojiezhe-api/, ""),
        },
      },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  }
});

