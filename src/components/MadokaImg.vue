<template>
  <div class="madoka-img-container" @click="Root.open">
    <img :src :loading class="main-img" alt="" draggable="false" />

    <div class="overlay">
      <div class="overlay-content">
        <i class="mdi mdi-image-filter-center-focus icon"></i>
        <span class="text">预览图片</span>
      </div>
    </div>

    <madoka-mask v-model="Root.show" @cancel="Root.close">
      <div v-if="Root.show" class="fixed-ui-layer">
        <div class="close-screen-btn" @click.stop="Root.close">
          <i class="mdi mdi-close"></i>
        </div>
      </div>

      <div v-if="Root.show" class="preview-content" :style="Root.previewStyle" @mousedown="Drag.start">
        <img :src="src" class="full-img" alt="" draggable="false" />
      </div>
    </madoka-mask>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onUnmounted } from "vue"
import MadokaMask from "@/components/MadokaMask.vue"

const props = withDefaults(
  defineProps<{
    src: string
    loading?: "lazy" | "eager"
  }>(),
  {
    loading: "lazy",
  },
)

const Root = (() => {
  const open = () => {
    s.show = true
  }
  const close = () => {
    s.show = false
    s.x = 0
    s.y = 0
  }
  const s = reactive({
    show: false,
    x: 0,
    y: 0,
    previewStyle: computed(() => ({
      transform: `translate(calc(-50% + ${s.x}px), calc(-50% + ${s.y}px))`,
      transition: s.isDragging ? "none" : "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    })),
    isDragging: false,
    startX: 0,
    startY: 0,
    open,
    close,
  })
  return s
})()

const Drag = (() => {
  const move = (e: MouseEvent) => {
    if (!Root.isDragging) return
    Root.x = e.clientX - Root.startX
    Root.y = e.clientY - Root.startY
  }

  const end = () => {
    Root.isDragging = false
    Root.x = 0
    Root.y = 0
    window.removeEventListener("mousemove", move)
    window.removeEventListener("mouseup", end)
  }

  const start = (e: MouseEvent) => {
    Root.isDragging = true
    Root.startX = e.clientX - Root.x
    Root.startY = e.clientY - Root.y
    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", end)
  }

  const s = reactive({
    start,
  })

  return s
})()

onUnmounted(() => {
  window.removeEventListener("mousemove", () => {})
  window.removeEventListener("mouseup", () => {})
})
</script>

<style scoped lang="less">
.madoka-img-container {
  position: relative;
  width: 250px;
  cursor: pointer;
  overflow: hidden;
  display: flex;

  .main-img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.3s ease;
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    backdrop-filter: blur(2px);
    .overlay-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: white;
      .icon {
        font-size: 28px;
      }
      .text {
        font-size: 12px;
      }
    }
  }

  &:hover {
    .main-img {
      transform: scale(1.05);
    }
    .overlay {
      opacity: 1;
    }
  }
}

.fixed-ui-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1000002;

  .close-screen-btn {
    position: absolute;
    top: 40px;
    right: 40px;
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    cursor: pointer;
    pointer-events: auto;
    transition: all 0.3s ease;

    &:hover {
      background: #ffb7c5;
      transform: rotate(90deg);
      box-shadow: 0 0 15px #ffb7c5;
    }
  }
}

.preview-content {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1000001;
  cursor: grab;
  user-select: none;

  &:active {
    cursor: grabbing;
  }

  .full-img {
    max-width: 85vw;
    max-height: 85vh;
    border-radius: 8px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
    pointer-events: none;
  }
}
</style>
