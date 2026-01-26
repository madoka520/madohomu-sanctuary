<template>
  <div class="madoka-live2d" :class="{ is_transparency: Madoka.isTransparency }">
    <canvas :ref="Madoka.ref.set"></canvas>
  </div>
</template>
<script setup lang="ts">
import * as PIXI from "pixi.js"
import { Live2DModel } from "pixi-live2d-display"
import { getAssetUrl } from "@/utils/resource.ts"
const Madoka = (() => {
  const init = async () => {
    // 将 PIXI 暴露到 window 上，这样插件就可以通过 window.PIXI.Ticker 来自动更新模型
    ;(<any>window).PIXI = PIXI

    const app = new PIXI.Application({
      view: s.ref.value,
      backgroundAlpha: 0,
    })
    const model = await Live2DModel.from(getAssetUrl("live2d-model/kami/model.model3.json"))
    app.stage.addChild(model)

    // 变换
    model.x = 100
    model.y = 100
    model.rotation = Math.PI
    model.skew.x = Math.PI
    model.scale.set(0.2, 0.2)
    model.anchor.set(1.1, 0.192)

    // 交互
    model.on("hit", (hitAreas) => {
      if (hitAreas.includes("body")) {
        model.motion("tap_body")
      }
    })
  }
  const handleMouseMove = () => {
    const { x, y } = s.mouse
    s.isTransparency = x + s.width > window.innerWidth && y + s.height > window.innerHeight
  }

  const s = reactive({
    width: 600,
    height: 480,
    cssWidth: computed((): string => `${s.width}px`),
    cssHeight: computed((): string => `${s.height}px`),
    isTransparency: false,
    ref: {
      value: undefined as HTMLCanvasElement | undefined,
      set(v: any) {
        s.ref.value = v
      },
    },
    mouse: useMouse(),
  })

  onMounted(init)
  watch(() => s.mouse, handleMouseMove, { deep: true })

  return s
})()
</script>

<style scoped lang="less">
.madoka-live2d {
  position: fixed;
  width: v-bind("Madoka.cssWidth");
  height: v-bind("Madoka.cssHeight");
  pointer-events: none;
  transition: 0.2s;
  z-index: 2;
  //
  bottom: 0;
  right: 0;
  &.is_transparency {
    opacity: 0.5;
  }

  & > canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>