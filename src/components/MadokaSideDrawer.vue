<template>
  <div class="peek-panel">
    <div class="header"><madoka-ripple style="padding: 10px" @click="dialogRef?.open()">发送留言</madoka-ripple></div>
    <slot />
    <pre-dialog ref="dialogRef"/>
  </div>
</template>

<script setup lang="ts">
import MadokaRipple from "@/components/MadokaRipple.vue";
import PreDialog from "@/views/SoulRippleSlot/PreDialog.vue";

const dialogRef = useTemplateRef("dialogRef")
</script>

<style scoped>
.peek-panel {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%) translateY(50%);
  padding: 14px 22px;
  border-radius: 16px 16px 0 0;

  /* 初始毛玻璃很弱（几乎没有） */
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);

  /* 光圈初始弱一点 */
  box-shadow:
    0 0 12px rgba(255, 255, 255, 0.3),
    0 0 24px rgba(255, 255, 255, 0.15);

  /* 动画关键点：blur + 透明度 + 阴影都可以 transition */
  transition:
    transform 0.25s,
    background 0.35s ease,
    backdrop-filter 0.35s ease,
    box-shadow 0.35s ease;
  &:hover {
    transform: translateX(-50%) translateY(0);

    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);

    box-shadow:
      0 0 25px rgba(255, 255, 255, 0.9),
      0 0 45px rgba(255, 255, 255, 0.7),
      0 0 70px rgba(255, 255, 255, 0.5),
      0 0 100px rgba(255, 255, 255, 0.3);
  }
}
.header {
  width: 100vw;
  height: 30px;
  display: flex;
  z-index: 1;
  cursor: pointer;
  padding-left: 15px;
}
</style>
