<template>
  <label class="madoka-checkbox" :class="{ 'is-checked': modelValue }">
    <input type="checkbox" v-model="modelValue" class="checkbox-input" />

    <div class="checkbox-visual">
      <span class="checkbox-inner">
        <span class="mdi mdi-check" v-if="modelValue"></span>
      </span>
      <span class="checkbox-label">
        <slot>{{ label }}</slot>
      </span>
    </div>
  </label>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string
  }>(),
  {},
)
const modelValue = defineModel({
  default: false,
})
</script>
<style lang="less" scoped>
@pink-primary: #ffb7c5;
@pink-dark: #ff85a2;

.madoka-checkbox {
  display: flex; // 建议改用 inline-flex，处理对齐更稳定
  align-items: center; // 垂直居中
  position: relative;
  cursor: pointer;
  .checkbox-input {
    // 关键：让 input 铺满整个 label 区域，但不可见
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    margin: 0;
    z-index: 2; // 确保在最上层响应点击
  }

  .checkbox-visual {
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 1;
  }

  .checkbox-inner {
    width: 20px;
    height: 20px;
    border: 2px solid @pink-primary;
    border-radius: 6px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;

    .mdi {
      color: white;
      font-size: 14px;
      animation: pop-in 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
  }

  .checkbox-label {
    color: @pink-dark;
    transform: translateY(-1.5px);
  }

  // 选中状态
  &.is-checked {
    .checkbox-inner {
      background-color: @pink-primary;
    }
    .checkbox-label {
      color: @pink-dark;
    }
  }
}

@keyframes pop-in {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
