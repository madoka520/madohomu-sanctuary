<!-- MadokaLineInput - 直角下划线输入框:透明底 + 常驻细粉底线,聚焦时强调线两端羽化晕开 -->
<!-- 与账号设置行的下划线语言同源;无圆角底衬,贴合 2026-09 默认形态(直角/透明底/细线) -->
<template>
  <div class="line-input">
    <input
      :type="type"
      v-model="modelValue"
      autocomplete="on"
      autocapitalize="off"
      spellcheck="false"
      :placeholder
    />
  </div>
</template>

<script setup lang="ts">
// 弹窗内的紧凑输入框,只保留最小 API:占位符与输入类型(text/password)
defineProps<{
  placeholder?: string
  type?: string
}>()
const modelValue = defineModel({
  default: "",
})
</script>

<style scoped lang="less">
@pink-dark: #ff85a2;

.line-input {
  position: relative;
  width: 100%;

  input {
    width: 100%;
    padding: 12px 10px;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    // 与 Dialog 粉乳玻璃主题的正文色同族
    color: #5f3a49;
    caret-color: @pink-dark;

    // 未激活占位灰,聚焦转粉
    &::placeholder {
      color: #9e9e9e;
      transition: color 0.3s ease;
    }
  }

  // 常驻细底线:与账号设置行同一条 1.5px 细粉线
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1.5px;
    background: rgba(255, 183, 213, 0.45);
  }

  // 聚焦强调线:两端透明羽化 + 淡入晕开,与账号行悬浮强调线同一支柔和曲线
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1.5px;
    background: linear-gradient(90deg, transparent, rgba(255, 133, 178, 0.85), transparent);
    opacity: 0;
    transform: scaleX(0.5);
    transform-origin: center;
    pointer-events: none;
    transition:
      transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  // hover 半醒:先给一小段低调暗示(非聚焦时)
  &:hover:not(:focus-within)::after {
    opacity: 0.3;
    transform: scaleX(0.6);
  }

  // 容器级聚焦:占位符转粉 + 强调线全宽晕开
  &:focus-within {
    input::placeholder {
      color: rgba(255, 133, 178, 0.6);
    }

    &::after {
      opacity: 1;
      transform: scaleX(1);
    }
  }
}
</style>
