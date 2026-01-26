<template>
  <div class="peek-panel" id="peek-panel" ref="peekPanelRef" tabindex="-1" :class="{ active: Root.active }">
    <div class="header">
      <madoka-btn class="send__button" type="3" @click="Root.openDialog" style="height: 40px"> <i class="mdi mdi-send" /> 发送留言 </madoka-btn>
      <madoka-btn class="today__count" type="3" @click="Root.openDialog" style="height: 40px">
        <i class="mdi mdi-counter" /> 今日留言{{Root.todayCount}}
      </madoka-btn>
      <madoka-btn type="3" @click="Root.goback" style="height: 40px"> <i class="mdi mdi-chevron-left" /> 返回 </madoka-btn>
    </div>
    <div class="content">
      <slot />
    </div>
    <pre-message-dialog ref="dialogRef" @cancel="Root.cancel" @ok="Root.ok($event)" />
  </div>
</template>

<script setup lang="ts">
import PreMessageDialog from "@/views/SoulRippleSlot/PreMessageDialog.vue"
import { useDrag } from "@vueuse/gesture"
import MadokaBtn from "@/components/button/Index.vue"
import messageApi from "@/api/MessageApi.ts"

const peekPanelRef = useTemplateRef("peekPanelRef")
const dialogRef = useTemplateRef("dialogRef")

const emits = defineEmits(["madokaScroll", "ok", "back"])

const Root = (() => {
  const ok = (e) => {
    s.todayCount++
    emits('ok', e)
  }
  const cancel = () => {
    setTimeout(() => {
      const listener = () => {
        s.active = false
        removeEventListener("click", listener)
      }
      addEventListener("click", listener)
    }, 500)
  }
  const openDialog = () => {
    dialogRef.value?.open()
    s.active = true
  }
  const getCount = async () => {
    s.todayCount = (await messageApi.count()) as unknown as number
  }

  /**
   * 返回上个场景
   */
  const goback = () => {
    emits("back")
  }
  const s = reactive({
    todayCount: 0,
    active: false,
    cancel,
    openDialog,
    goback,
    ok
  })
  getCount()
  return s
})()
useDrag(
  (state) => {
    const swipeX = state.swipe[0] // 横向滑动
    const el = state.event!.target as HTMLElement
    emits("madokaScroll", { el, delta: -swipeX })
  },
  {
    domTarget: peekPanelRef,
  },
)
</script>

<style scoped>
.peek-panel {
  position: absolute;
  width: 100%;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%) translateY(50%);

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
