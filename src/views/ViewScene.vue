<template>
  <div class="pendulum">
    <img
      src="@/assets/images/main_scene/pendulum.png"
      alt=""
      draggable="false"
    />
  </div>
  <div class="scene"/>
  <slot />
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.scene {
  position: fixed;
  inset: 0;
  z-index: -1;
  background-image: url('@/assets/images/main_scene/chair.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.pendulum {
  z-index: 1000;
  position: fixed;
  top: -10px;
  pointer-events: none;
  user-select: none;
  opacity: 0.6;
  display: flex;
  inset: 0;
  justify-content: center;
  align-items: start;

  img {
    animation: swing 12s infinite ease-in-out;
    transform-origin: 50% -35vw; // 用相对单位避免超出屏幕！
    display: block;
    filter: brightness(0%);
    max-height: 60vh; // 限制最大高度
    max-width: 80vw; // 限制最大宽度
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
</style>
