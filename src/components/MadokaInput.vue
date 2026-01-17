<!-- PinkMagicInput.vue - 封装的魔法少女小圆粉色下划线输入组件 -->
<template>
  <div class="madoka__input">
    <span class="icon" v-if="leftIcon">
      <i :class="`mdi ${leftIcon}`"></i>
    </span>
    <input
      :type="resolvedType"
      v-model="modelValue"
      autocomplete="on"
      autocapitalize="off"
      spellcheck="false"
      :placeholder
    />
    <span class="icon" v-if="rightIcon">
      <i :class="`mdi ${rightIcon}`" class="show-or-hidden-psd" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
  modelValue?: string
  leftIcon?: string
  rightIcon?: string
  placeholder?: string
  type?: string
  showPassword?: boolean // 用于 password 时动态 type
}>()
const modelValue = defineModel({
  default: "",
})

// 自动处理 password 显示/隐藏
const resolvedType = computed(() => {
  if (props.type === "password" && props.showPassword) {
    return "text"
  }
  return props.type || "text"
})
</script>

<style scoped>
/* 魔法少女小圆粉色系下划线输入样式（提取自原组件） */
.madoka__input {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 20px;
  color: #bdbdbd;
  margin: 0 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mdi {
  font-size: 20px;
}

input {
  flex: 1;
  padding: 36px 0 30px 10px;
  border: none;
  background: transparent;
  font-size: 16px;
  font-weight: 400;
  color: #424242;
  outline: none;
  border-bottom: 1px solid transparent;
  transition: color 0.3s ease;


  height: 0;
  background-clip: content-box;
}

input::placeholder {
  color: #9e9e9e;
  transition: color 0.3s ease;
}

/* 下划线：基础灰 + 粉色魔法动画 */
.madoka__input::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: rgba(189, 189, 189, 0.7);
  transition: opacity 0.3s ease;
  z-index: 1;
}

/* 优化后的下划线部分 */
.madoka__input::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%; /* 使用 width 代替 right:0 有时更稳定 */
  height: 2px;
  /* 使用更扎实的颜色过渡，避免 0% 处透明 */
  background: linear-gradient(90deg, pink 0%, #ff69b4 50%, pink 100%);
  box-shadow: 0 0 6px rgba(255, 105, 180, 0.5);

  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

/* Focus：粉色绽放 */
.madoka__input:focus-within input {
  color: #ff69b4;
}

.madoka__input:focus-within input::placeholder {
  color: rgba(255, 105, 180, 0.5);
}

.madoka__input:focus-within .icon .mdi {
  color: #ff69b4;
  transform: scale(1.1) rotate(5deg);
}

.madoka__input:focus-within::before {
  opacity: 0;
}

.madoka__input:focus-within::after {
  transform: scaleX(1);
}

.madoka__input:focus-within {
  /* 魔法光晕 */
  box-shadow:
    0 4px 20px rgba(255, 105, 180, 0.3),
    0 0 0 1px rgba(255, 105, 180, 0.2);
}

/* Hover */
.madoka__input:hover:not(:focus-within) {
  .madoka__input::after {
    transform: scaleX(0.6);
  }

  .icon .mdi {
    color: rgba(255, 105, 180, 0.7);
  }
}

.show-or-hidden-psd {
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    color: #e91e63 !important;
    transform: scale(1.15) rotate(10deg);
  }
}
</style>
