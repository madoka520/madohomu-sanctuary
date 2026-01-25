<template>
  <div class="outline-btn">
    <slot>
      {{text}}
    </slot>
  </div>
</template>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    text?: string;
  }>(),
  {

  }
)
</script>
<style scoped>
.outline-btn {
  /* 基础：透明背景 + 粉色细边框 */
  padding: 10px 30px;
  font-size: 14px;
  font-weight: 500;
  color: #ff7eb9;
  background: transparent;
  border: 1px solid rgba(255, 126, 185, 0.5);
  border-radius: 4px; /* 微圆角，更显科技利落感 */

  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  letter-spacing: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  position: relative;
}

/* 悬浮效果：填充感与发光 */
.outline-btn:hover {
  background: rgba(255, 126, 185, 0.08); /* 极淡的背景填充 */
  border-color: #ff7eb9;
  color: #fff;
  /* 梦幻的霓虹发光感 */
  box-shadow: 0 0 15px rgba(255, 126, 185, 0.4);
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

/* 点击反馈 */
.outline-btn:active {
  transform: scale(0.96);
  background: rgba(255, 126, 185, 0.2);
}
</style>
