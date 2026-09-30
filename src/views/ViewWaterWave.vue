<!-- 新增文件：首屏液面水波 —— 参考站 funingna-wakawaka.github.io 同款 Three.js 液面（liquid1.min.js），
     鼠标轨迹涟漪为库内置（监听 document.body），折射纹理为首屏背景图 -->
<template>
  <canvas ref="canvasRef" class="water-canvas"></canvas>
</template>

<script setup lang="ts">
defineOptions({ name: 'view-water-wave' })
import chairUrl from '@/assets/images/main_scene/chair.jpg'

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef')

// =========start========== 液面实例句柄（非响应式，避免代理 Three.js 对象）
let app: any = null

onMounted(async () => {
  try {
    // vendor 库随 public 目录部署，运行时原生动态加载。
    // 👉 必须用 new Function 构造 import：Vite dev 会把组件里的动态 import() 改写成 ?import
    //    请求，public 目录文件走该路径会 500；Function 内的 import 不经过 Vite 分析
    const nativeImport = new Function('url', 'return import(url)') as (u: string) => Promise<any>
    const m: any = await nativeImport('/dev-cdn/js/liquid1.min.js')
    if (!canvasRef.value) return
    app = m.default(canvasRef.value)
    // 与参考站一致的液面质感
    app.liquidPlane.material.metalness = 0.35
    app.liquidPlane.material.roughness = 0.45
    app.liquidPlane.uniforms.displacementScale.value = 1 // 波动幅度（参考站为 2，减半更柔和）
    app.setRain(false)
    // 折射纹理 = 首屏的椅子背景图（打包产物同源，无 CORS 问题）
    await app.loadImage(chairUrl)
  } catch (e) {
    // WebGL 不可用等情况：画布保持透明，下层的静态背景图兜底
    console.error('[ViewWaterWave] 液面加载失败:', e)
  }
})

onBeforeUnmount(() => {
  app?.dispose?.()
  app = null
})
// ========end========
</script>

<style scoped lang="less">
.water-canvas {
  position: fixed;
  inset: 0;
  z-index: -1; // 与 .scene 同层，DOM 顺序在后 → 盖在静态背景图上方
  width: 100vw;
  height: 100vh;
  pointer-events: none; // 交互监听在 document.body 上，画布不拦截事件
  // 💡 涟漪注入强度在库内部无对外接口，用半透明混合代替：
  // 液面折射与下层静态背景图融合，扭曲变成含蓄的水面微光而不是整幅变形
  opacity: 0.3;
}
</style>
