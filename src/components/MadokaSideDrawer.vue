<template>
  <div class="peek-panel" id="peek-panel" ref="peekPanelRef" tabindex="-1" :class="{ active: Root.active }">
    <div class="header">
      <!--      <madoka-ripple style="padding: 10px" >发送留言</madoka-ripple>-->
      <madoka-btn type="3" text="发送留言" @click="Root.openDialog" style="height: 40px" />
    </div>
    <div class="content">
      <slot />
    </div>
    <pre-message-dialog ref="dialogRef" @cancel="Root.cancel" @ok="(e) => emits('ok', e)" />
  </div>
</template>

<script setup lang="ts">
import PreMessageDialog from "@/views/SoulRippleSlot/PreMessageDialog.vue"
import { useDrag } from "@vueuse/gesture"
import MadokaBtn from "@/components/button/Index.vue"

const peekPanelRef = useTemplateRef("peekPanelRef")
const dialogRef = useTemplateRef("dialogRef")
const Root = (() => {
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
  const s = reactive({
    active: false,
    cancel,
    openDialog,
  })
  return s
})()
const emits = defineEmits(["madokaScroll", "ok"])
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
  }

  .header {
    width: 100vw;
    height: 30px;
    display: flex;
    z-index: 1;
    padding-left: 15px;
    position: relative;
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
