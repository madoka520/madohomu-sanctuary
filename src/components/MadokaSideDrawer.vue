<template>
  <div v-if="Root.active" class="peek-panel__mask" @click="Root.close" />
  <div
    class="peek-panel"
    id="peek-panel"
    ref="peekPanelRef"
    tabindex="-1"
    :class="{ active: Root.active }"
    @click.capture="Root.lockActive"
  >
    <div class="header">
      <div class="header__left">
        <madoka-btn
          class="send__button"
          type="3"
          @click="emits('handleSent')"
          style="height: 40px"
        >
          <i class="mdi mdi-send" />
          发送留言
        </madoka-btn>
        <madoka-btn class="today__count" type="3" style="height: 40px">
          <i class="mdi mdi-counter" />
          今日留言{{ todayCount }}
        </madoka-btn>
        <madoka-btn class="site-uptime" type="3" style="height: 40px">
          <i class="mdi mdi-timer-outline" />
          已运行 {{ Uptime.text }}
        </madoka-btn>
      </div>
      <div style="display: flex; gap: 10px">
        <madoka-btn
          type="3"
          style="height: 40px"
          v-if="Root.isMobile()"
          @click="
            () => {
              Root.close()
              peekPanelRef?.blur()
            }
          "
        >
          <i class="mdi mdi-window-minimize" />
        </madoka-btn>
        <madoka-btn
          type="3"
          @click="Root.goback"
          style="height: 40px"
          class="return__button"
        >
          <i class="mdi mdi-chevron-left" />
        </madoka-btn>
      </div>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDrag } from '@vueuse/gesture'
import { MadokaBtn } from '@madoka520/vue-ui'
import dayjs from 'dayjs'
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
    isMobile: isMobile,
    lockActive,
    goback,
    close,
  })
  return s
})()
// =========start========== 本站运行时长（起点取仓库 Initial commit，正式上线日不同改这里即可）
const SITE_LAUNCH_TIME = dayjs('2025-05-27 22:49:00')

const Uptime = (() => {
  const refresh = () => {
    const total = Math.max(0, dayjs().diff(SITE_LAUNCH_TIME, 'second'))
    const years = Math.floor(total / 31536000) // 按 365 天/年折算
    const days = Math.floor((total % 31536000) / 86400)
    const hours = Math.floor((total % 86400) / 3600)
    const mins = Math.floor((total % 3600) / 60)
    const secs = total % 60
    s.text = `${years}年${days}天${hours}小时${mins}分${secs}秒`
  }
  const s = reactive({
    text: '',
    refresh,
  })
  return s
})()
useIntervalFn(Uptime.refresh, 1000, { immediateCallback: true })
// ========end========
useDrag(
  (state) => {
    if (!state.dragging) return

    const el = state.event!.target as HTMLElement
    const liveX = state.delta[0]

    emits('madokaScroll', {
      el,
      delta: -liveX,
      dragging: true,
    })
  },
  {
    domTarget: peekPanelRef,
  },
)
</script>

<style scoped lang="less">
.box-shadow(@color: rgba(255, 255, 255, 0.2), @size1: 30px, @size2: 60px, @size3: 110px, @size4: 160px) {
  box-shadow:
    0 0 @size1 @color,
    0 0 @size2 @color,
    0 0 @size3 @color,
    0 0 @size4 @color;
}

.peek-panel__mask {
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: 1;
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
    height: 30px;
    display: flex;
    justify-content: space-between;
    z-index: 1;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;

    // =========start========== 左侧聚簇（发送留言 + 运行时长），对齐右侧返回按钮组的间距
    .header__left {
      display: flex;
      gap: 10px;
      flex-shrink: 0;
    }
    // ========end========

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

    // =========start========== 运行时长：与今日留言同类的信息标签，
    // 显隐节奏与样式（平贴形态）完全跟随 today__count
    .site-uptime {
      pointer-events: none;
      border-top: none;
      border-left: none;
      border-right: none;
      white-space: nowrap;
    }
    // ========end========

    .return__button {
      display: none;
    }
  }
  &:hover,
  &:focus-within {
    transform: translateX(-50%) translateY(0);

    .content {
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);

      .box-shadow();
    }
    .send__button {
      display: inline-flex;
    }
    .today__count {
      display: none;
    }

    // =========start========== 上浮时运行时长与今日留言一起隐藏（同为信息标签）
    .site-uptime {
      display: none;
    }
    // ========end========

    .return__button {
      display: inline-flex;
    }
  }
}

.active {
  transform: translateX(-50%) translateY(0);

  .content {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);

    .box-shadow();
  }
}
</style>
