<template>
  <div class="theme__container">
    <div class="bg">
      <div v-if="Root.currentTheme.type === 'video'">
        <video autoplay muted loop style="width: 100%; height: 100%">
          <source :src="Root.currentTheme.src" />
        </video>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IThemeType } from "@/components/project/pre-home-theme/types.ts"
import { getVideoUrl } from "@/utils/resource.ts"

defineOptions({
  name: "pre-home-theme",
})

const Root = (() => {
  const s = reactive({
    current: "default",
    currentTheme: computed(() => s.list[s.current]),
    list: {
      default: {
        type: "video",
        src: getVideoUrl("madoka-op-muted.webm"),
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
