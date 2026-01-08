<template>
  <canvas ref="ref_canvas" :width="width" :height="height" class="canvas"></canvas>
</template>
<script lang="ts" setup>
const ref_canvas = useTemplateRef("ref_canvas")
import { particle_list, type I } from "@/utils/ParticleUtils"

const width = ref(window.innerWidth)
const height = ref(window.innerHeight)
let ctx: CanvasRenderingContext2D | undefined | null

const checkCtx = (ctx: CanvasRenderingContext2D | undefined | null): ctx is CanvasRenderingContext2D => !!ctx

const drawImg = (particle: I.Particle) => {
  if (!checkCtx(ctx)) return
  ctx.save()
  ctx.globalAlpha = particle.opacity
  ctx.translate(particle.x + particle.w / 2, particle.y + particle.h / 2)
  ctx.rotate(particle.rotate)
  ctx.drawImage(particle.img, -particle.w / 2, -particle.h / 2, particle.w, particle.h)
  ctx.restore()
}

const render = () => {
  requestAnimationFrame(() => render())
  if (!checkCtx(ctx)) return
  ctx?.clearRect(0, 0, width.value, height.value)
  particle_list.forEach((particle: I.Particle) => {
    drawImg(particle)
  })
}

onMounted(() => {
  ctx = ref_canvas.value?.getContext("2d")
})

render()
</script>
<style lang="less" scoped>
.canvas {
  position: fixed;
  display: block;
  width: 100vw;
  height: 100vh;
  inset: 0;
  pointer-events: none;
  z-index: 9999999999;
}
</style>
