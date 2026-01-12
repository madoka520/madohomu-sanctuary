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
import emitter from "@/utils/emitter.ts"
import useSetting from "@/hooks/useSetting.ts"

defineOptions({
  name: "pre-home-theme",
})
const setting = useSetting()
const Root = (() => {
  const s = reactive({
    currentTheme: computed(() => setting.themeList[useSetting().theme]),
  })
  return s
})()

;(() => {
  let startX = 0
  let isDragging = false

  const onPointerDown = (e: PointerEvent) => {
    const container = document.querySelector(".theme__container")
    if (!container?.contains(e.target as Node)) return // 不在容器内就直接返回

    startX = e.clientX
    isDragging = true
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging) return
    // 可选：这里可以做拖动效果，但不需要
  }

  const onPointerUp = (e: PointerEvent) => {
    if (!isDragging) return
    const deltaX = e.clientX - startX

    if (deltaX > 50) {
      emitter.emit("bg-slide-prev") // 向右滑
    } else if (deltaX < -50) {
      emitter.emit("bg-slide-next") // 向左滑
    }

    isDragging = false
  }

  onMounted(() => {
    window.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
  })

  onBeforeUnmount(() => {
    window.removeEventListener("pointerdown", onPointerDown)
    window.removeEventListener("pointermove", onPointerMove)
    window.removeEventListener("pointerup", onPointerUp)
  })
})()
</script>

<style scoped>
.theme__container {
  width: 100vw;
  height: 100vh;
  .bg {
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
  }
}
</style>
