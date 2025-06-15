<template>
  <div class="scene">
    <div class="pendulum">
      <img src="@/assets/images/main_scene/pendulum.png" alt="pendulum" draggable="false"/>
    </div>
  </div>
  <slot/>
</template>

<script setup lang="ts">
</script>

<style scoped lang="less">
.scene {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  // 用 grid 水平居中
  display: grid;
  justify-items: center;
  z-index: 1000;
  .pendulum {
    z-index: 1000;
    position: relative;
    height: 0; // 包裹器本身没有高度
    top: -10px;
    pointer-events: none;
    user-select: none;
    display: inline-block;
    opacity: .6;

    img {
      animation: swing 12s infinite ease-in-out;
      transform-origin: 50% -35vw; // 用相对单位避免超出屏幕！
      display: block;
      filter: brightness(0%);
      max-height: 60vh; // 限制最大高度
      max-width: 80vw; // 限制最大宽度
      width: auto;
      height: auto;
    }
  }

  @keyframes swing {
    0% {
      transform: rotate(-24deg);
    }
    50% {
      transform: rotate(24deg);
    }
    100% {
      transform: rotate(-24deg);
    }
  }


}

</style>
