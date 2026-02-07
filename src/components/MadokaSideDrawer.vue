<template>
  <div v-if="Root.active" class="peek-panel__mask" @click="Root.close" />
  <div class="peek-panel" id="peek-panel" ref="peekPanelRef" tabindex="-1" :class="{ active: Root.active }" @click.capture="Root.lockActive">
    <div class="header">
      <madoka-btn class="send__button" type="3" @click="emits('handleSent')" style="height: 40px">
        <i class="mdi mdi-send" />
        发送留言
      </madoka-btn>
      <madoka-btn class="today__count" type="3" style="height: 40px">
        <i class="mdi mdi-counter" />
        今日留言{{ todayCount }}
      </madoka-btn>
      <madoka-btn type="3" @click="Root.goback" style="height: 40px" v-if="Root.active">
        <i class="mdi mdi-chevron-left" />
        返回
      </madoka-btn>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDrag } from '@vueuse/gesture'
import MadokaBtn from '@/components/button/Index.vue'

const peekPanelRef = useTemplateRef('peekPanelRef')

const emits = defineEmits(['madokaScroll', 'ok', 'back', 'handleSent'])
const props = withDefaults(
  defineProps<{
    todayCount?: number
  }>(),
  {},
)
const Root = (() => {
  const close = () => {
    s.active = false
  }

  const lockActive = () => {
    s.active = true
  }

  /**
   * 返回上个场景
   */
  const goback = () => {
    emits('back')
  }
  const s = reactive({
    active: false,
    lockActive,
    goback,
    close,
  })
  return s
})()
useDrag(
  (state) => {
    const swipeX = state.swipe[0] // 横向滑动
    const el = state.event!.target as HTMLElement
    emits('madokaScroll', { el, delta: -swipeX })
  },
  {
    domTarget: peekPanelRef,
  },
)
</script>

<style scoped>
.peek-panel__mask {
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: 0;
}

.peek-panel {
  position: absolute;
  width: 100%;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%) translateY(50%);
  z-index: 1;
  /* 动画关键点：blur + 透明度 + 阴影都可以 transition */
  transition:
    transform 0.55s,
    background 0.35s ease,
    backdrop-filter 0.35s ease,
    box-shadow 0.35s ease;

  .header {
    width: 100vw;
    height: 30px;
    display: flex;
    justify-content: space-between;
    z-index: 1;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;

    .send__button {
      display: none;
      user-select: none;
    }

    .today__count {
      pointer-events: none;
      border-top: none;
      border-left: none;
      border-right: none;
    }
  }
  &:hover,
  &:focus-within {
    transform: translateX(-50%) translateY(0);

    .content {
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);

      box-shadow:
        0 0 30px rgba(255, 255, 255, 0.2),
        0 0 60px rgba(255, 255, 255, 0.2),
        0 0 110px rgba(255, 255, 255, 0.2),
        0 0 160px rgba(255, 255, 255, 0.2);
    }
    .send__button {
      display: flex;
    }
    .today__count {
      display: none;
    }
  }
}

.active {
  transform: translateX(-50%) translateY(0);

  .content {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);

    box-shadow:
      0 0 30px rgba(255, 255, 255, 0.2),
      0 0 60px rgba(255, 255, 255, 0.2),
      0 0 110px rgba(255, 255, 255, 0.2),
      0 0 160px rgba(255, 255, 255, 0.2);
  }
}
</style>
