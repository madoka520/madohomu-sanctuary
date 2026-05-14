<template>
  <madoka-mask v-model="modelValue" v-if="!unuseModel">
    <div
      class="dialog__overlay"
      :style="{ minWidth: width, minHeight: height, background }"
      @click.stop
      ref="overlayRef"
    >
      <!--      <madoka-meteor-shower/>-->
      <header v-if="title || $slots.header">
        <slot name="header">
          {{ title }}
        </slot>
      </header>
      <main style="overflow: hidden">
        <slot />
      </main>
      <footer v-if="footer">
        <slot name="footer">
          <madoka-btn
            type="1"
            @click="Root.cancel"
            v-if="!hiddenCancel"
            :text="cancelText"
            variant="outlined"
            color="pink"
          />
          <madoka-btn
            type="1"
            @click="Root.ok"
            :text="okText"
            variant="outlined"
            color="pink"
          />
        </slot>
      </footer>
    </div>
  </madoka-mask>
  <slot v-else />
</template>
<script setup lang="ts">
import MadokaMask from '@/components/MadokaMask.vue'
import MadokaBtn from '@/components/button/Index.vue'

const props = withDefaults(
  defineProps<{
    width?: string
    height?: string
    footer?: boolean
    title?: string
    okText?: string
    cancelText?: string
    unuseModel?: boolean
    background?: string
    hiddenCancel?: boolean
  }>(),
  {
    title: '',
    footer: true,
    width: '400px',
    height: '300px',
    okText: '确 定',
    cancelText: '取 消',
    unuseMode: false,
    background: 'rgba(255, 240, 245, 0.7)',
    hiddenCancel: false,
  },
)

const overlayRef = useTemplateRef('overlayRef')

const mouse = useMouse()
const modelValue = defineModel({
  default: false,
})
const emits = defineEmits<{
  (e: 'cancel', event?: Event): void
  (e: 'ok', event: Event): void
}>()

const Root = (() => {
  const setWatcher = () => {
    watch(modelValue, (visible) => {
      const el = overlayRef.value
      if (!el) return

      if (visible) {
        /* —— 打开 —— */
        nextTick(async () => {
          const { width: w, height: h } = el.getBoundingClientRect()
          const left = mouse.x.value - w * 5
          const top = mouse.y.value - h * 5

          s.lastX = left
          s.lastY = top
          /* 初始状态：在鼠标中心缩小、透明 */
          Object.assign(el.style, {
            left: left + 'px',
            top: top + 'px',
          })
          /* 下一帧触发过渡到居中放大 */
          requestAnimationFrame(() => el.classList.add('enter-active'))
        })
      } else {
        /* —— 关闭 —— */

        nextTick(() => {
          // 移除打开状态类
          el.classList.remove('enter-active')
          // 添加关闭状态类，触发淡出动画
          el.classList.add('leave-active')

          // 监听动画结束事件
          const onEnd = (e: TransitionEvent) => {
            if (e.target === el) {
              el.removeEventListener('transitionend', onEnd)
              el.classList.remove('leave-active')
              Object.assign(el.style, {
                // 还原初始内联样式
                transform: '',
                opacity: '',
                left: '-99999px',
                top: '-99999px',
              })
            }
          }
          el.addEventListener('transitionend', onEnd)
        })

        emits('cancel')
      }
    })
  }

  const cancel = async (e: Event) => {
    modelValue.value = false
    emits('cancel', e)
  }
  const ok = async (e: Event) => {
    emits('ok', e)
  }
  const s = reactive({
    lastX: 0,
    lastY: 0,
    ok,
    cancel,
  })
  setWatcher()
  return s
})()
</script>
<style lang="less" scoped>
.dialog__overlay {
  display: flex;
  flex-direction: column;
  position: fixed;
  transform: scale(0.1);
  border-radius: 29px; // LR_小さな狐の妖精
  corner-shape: superellipse(1.333);
  left: -99999px;
  top: -99999px;
  // ✨ 核心增强：只添加毛玻璃和微光边框，不改动布局逻辑
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px rgba(255, 183, 197, 0.3);

  background: white;
  overflow: hidden;
  opacity: 0;

  header {
    padding: 20px;
    // 增加一个粉色文字默认样式
    font-weight: bold;
    color: #ff8fab;
  }

  main {
    padding: 0 20px;
    flex: 1;
    overflow: auto;
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 0;
  }

  footer {
    display: flex;
    justify-content: end;
    padding: 20px;
    gap: 10px;
  }
}

.dialog__overlay.enter-active {
  left: 50% !important;
  top: 50% !important;
  transform: translate(-50%, -50%) scale(1) !important;
  opacity: 1 !important;
  transition: all 0.3s cubic-bezier(0.1, 1, 0.4, 1);
}

.dialog__overlay.leave-active {
  opacity: 0 !important;
  transition: all 0.3s cubic-bezier(0.1, 1, 0.4, 1);
  pointer-events: none;
}
</style>
