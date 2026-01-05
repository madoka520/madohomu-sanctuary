<template>
  <div class="theme__container">
    <div class="bg">
      <div v-if="Root.currentTheme.type === 'video'">
        <video autoplay muted loop style="width: 100%; height: 100%">
          <source :src="Root.currentTheme.src" />
        </video>
      </div>
      <component :is="Root.currentTheme.component" v-else-if="Root.currentTheme.type === 'customer'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IThemeType } from "@/components/project/pre-home-theme/types.ts"
import { getImgUrl, getVideoUrl } from "@/utils/resource.ts"

defineOptions({
  name: "pre-home-theme",
})
const toAsyncComponent = <T extends Component>(comp: () => Promise<T>) => markRaw(defineAsyncComponent(comp))

const Root = (() => {
  const s = reactive({
    current: "kami",
    currentTheme: computed(() => s.list[s.current]),
    list: {
      default: {
        type: "video",
        src: getVideoUrl("madoka-op-muted.webm"),
      },
      kami: {
        type: "customer",
        component: toAsyncComponent(() => import("@/components/project/pre-home-theme/components/kami/Index.vue")),
      },
    } as Record<string, IThemeType>,
  })
  return s
})()
</script>

<style scoped>
.theme__container {
  width: 100vw;
  height: 100vh;
  .bg {
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
}
</style>
