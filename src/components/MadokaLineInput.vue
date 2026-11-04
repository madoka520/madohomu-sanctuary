<!-- MadokaLineInput - 直角下划线输入框:透明底 + 常驻细粉底线,聚焦时强调线两端羽化晕开 -->
<!-- 与账号设置行的下划线语言同源;无圆角底衬,贴合 2026-09 默认形态(直角/透明底/细线) -->
<!-- 可选左右图标(登录页账号/锁/眼睛):图标悬于线上方,聚焦时转粉微旋 -->
<template>
  <div class="line-input">
    <span v-if="leftIcon" class="icon">
      <i :class="leftIcon"></i>
    </span>
    <input
      :type="resolvedType"
      v-model="modelValue"
      autocomplete="on"
      autocapitalize="off"
      spellcheck="false"
      :placeholder
    />
    <span v-if="rightIcon" class="icon icon--action" @click="emits('rightIconClick')">
      <i :class="rightIcon"></i>
    </span>
  </div>
</template>

<script setup lang="ts">
// 最小 API:占位符、输入类型、可选图标;showPassword 用于 password 时切换明文
const props = defineProps<{
  placeholder?: string
  type?: string
  leftIcon?: string
  rightIcon?: string
  showPassword?: boolean
}>()
const emits = defineEmits(['rightIconClick'])
const modelValue = defineModel({
  default: "",
})
// password + showPassword → 明文,其余原样
const resolvedType = computed(() => {
  if (props.type === "password" && props.showPassword) {
    return "text"
  }
  return props.type || "text"
})
</script>

<style scoped lang="less">
@pink-dark: #ff85a2;

.line-input {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

  input {
    flex: 1;
    min-width: 0;
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

  .icon {
    display: flex;
    align-items: center;
    font-size: 19px;
    color: #bdbdbd;
    padding: 0 6px;
    transition: color 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    // 可点图标(密码可见切换):hover 转粉放大
    &--action:hover {
      color: @pink-dark;
      transform: scale(1.15);
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

  // 容器级聚焦:占位符转粉 + 图标转粉微旋 + 强调线全宽晕开
  &:focus-within {
    input::placeholder {
      color: rgba(255, 133, 178, 0.6);
    }

    .icon {
      color: @pink-dark;
      transform: scale(1.1) rotate(5deg);
    }

    &::after {
      opacity: 1;
      transform: scaleX(1);
    }
  }
}
</style>
