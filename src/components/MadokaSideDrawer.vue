<template>
  <div class="peek-panel" id="peek-panel">
    <div class="header"><madoka-ripple style="padding: 10px" @click="dialogRef?.open()">发送留言</madoka-ripple></div>
    <div class="content">
      <slot />
    </div>
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
  position: absolute;
  width: 100%;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%) translateY(50%);

  /* 动画关键点：blur + 透明度 + 阴影都可以 transition */
  transition:
    transform 0.25s,
    background 0.35s ease,
    backdrop-filter 0.35s ease,
    box-shadow 0.35s ease;
  &:hover {
    transform: translateX(-50%) translateY(0);

    .content {
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);

      box-shadow:
        0 0 30px rgba(255, 255, 255, .2),
        0 0 60px rgba(255, 255, 255, .2),
        0 0 110px rgba(255, 255, 255, .2),
        0 0 160px rgba(255, 255, 255, .2);
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

</style>
