<template>
  <canvas ref="canvasRef" :width="width" :height="height" class="madoka-loading"></canvas>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { MadokaLoadingProps } from './types'
import { LAW_OF_CYCLES } from './lawOfCycles'
import { drawLawOfCycles } from './render'

const props = withDefaults(defineProps<MadokaLoadingProps>(), {
  size: 220,
  paused: false,
})

/** 设计稿比例 440x607(竖版) */
const width = computed(() => Math.round(props.size))
const height = computed(() => Math.round((props.size * 607) / 440))

const canvasRef = ref<HTMLCanvasElement | null>(null)
let raf = 0
let t0 = 0

const tick = (now: number) => {
  const cv = canvasRef.value
  if (cv) {
    const ctx = cv.getContext('2d')
    if (ctx) drawLawOfCycles(ctx, LAW_OF_CYCLES, (now - t0) % LAW_OF_CYCLES.cycle, cv.width, cv.height)
  }
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  t0 = performance.now()
  raf = requestAnimationFrame(tick)
})
onUnmounted(() => cancelAnimationFrame(raf))

// 暂停/恢复: 恢复时重置时间基准, 从头开始一轮
watch(
  () => props.paused,
  (paused) => {
    cancelAnimationFrame(raf)
    if (!paused) {
      t0 = performance.now()
      raf = requestAnimationFrame(tick)
    }
  },
)
</script>

<style scoped>
.madoka-loading {
  display: block;
}
</style>
