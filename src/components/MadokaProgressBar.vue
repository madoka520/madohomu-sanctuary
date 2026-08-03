<template>
  <!-- [Ethan] MadokaProgressBar — 通用细线型进度条，支持确定/不确定两种模式 -->
  <div
    class="madoka-progress-bar"
    :class="{ 'is-indeterminate': indeterminate }"
    :style="ProgressBar.trackStyle"
    role="progressbar"
    :aria-valuenow="indeterminate ? undefined : ProgressBar.displayValue"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <!-- [Ethan] 不确定模式：滑动色块动画 -->
    <div v-if="indeterminate" class="madoka-progress-bar__seg" :style="ProgressBar.fillStyle" />
    <!-- [Ethan] 确定模式：宽度百分比填充 -->
    <div v-else class="madoka-progress-bar__fill" :style="ProgressBar.fillStyle" />
  </div>
</template>

<script setup lang="ts">
// [Ethan] MadokaProgressBar 组件

const props = withDefaults(
  defineProps<{
    /** 0-100 百分比。indeterminate 为 true 时此值被忽略 */
    value?: number
    /** 是否为不确定模式（显示滑动动画） */
    indeterminate?: boolean
    /** 填充色，不传则使用主题粉色渐变 #ffb7ce → #ff69b4 */
    color?: string
    /** 轨道背景色 */
    trackColor?: string
    /** 进度条高度 px */
    height?: number
    /** 确定模式下宽度过渡时长 ms */
    duration?: number
  }>(),
  {
    value: 0,
    indeterminate: false,
    trackColor: 'rgba(255, 183, 197, 0.25)',
    height: 3,
    duration: 400,
  },
)

const emits = defineEmits<{ (e: 'finish'): void }>()

// [Ethan] ProgressBar IIFE 模块
const ProgressBar = (() => {
  const init = () => {}

  const s = reactive({
    /** 钳制到 0-100 的显示值；不确定模式返回 0 */
    displayValue: computed(() => {
      if (props.indeterminate) return 0
      const v = Number(props.value)
      if (Number.isNaN(v)) return 0
      return Math.min(Math.max(v, 0), 100)
    }),

    /** 外层轨道样式 */
    trackStyle: computed(() => ({
      height: `${props.height}px`,
      backgroundColor: props.trackColor,
      borderRadius: '999px',
    })),

    /** 内层填充/滑动色块样式 */
    fillStyle: computed(() => {
      const base: Record<string, string> = {
        width: props.indeterminate ? '35%' : `${s.displayValue}%`,
        borderRadius: '999px',
        transitionDuration: `${props.duration}ms`,
      }
      if (props.color) {
        base.background = props.color
      }
      return base
    }),
  })

  // [Ethan] 确定模式下 value 到达 100 时触发 finish 事件
  watch(
    () => s.displayValue,
    (v, old) => {
      if (!props.indeterminate && v >= 100 && (old ?? 0) < 100) {
        emits('finish')
      }
    },
  )

  init()
  return s
})()
</script>

<style scoped>
/* [Ethan] 进度条轨道 */
.madoka-progress-bar {
  position: relative;
  width: 100%;
  overflow: hidden;
}

/* [Ethan] 确定模式 — 填充条，CSS transition 平滑过渡 */
.madoka-progress-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, #ffb7ce, #ff69b4);
  box-shadow: 0 0 6px rgba(255, 105, 180, 0.4);
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: width;
}

/* [Ethan] 不确定模式 — 滑动色块，CSS @keyframes 驱动 */
.madoka-progress-bar__seg {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #ffb7ce, #ff69b4);
  box-shadow: 0 0 8px rgba(255, 105, 180, 0.5);
  will-change: transform;
  animation: pb-indeterminate 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

/* [Ethan] 不确定模式动画：35% 宽的色块从左侧滑入 → 右侧滑出，循环往复 */
@keyframes pb-indeterminate {
  0% {
    transform: translateX(-300%);
  }
  100% {
    transform: translateX(300%);
  }
}
</style>
