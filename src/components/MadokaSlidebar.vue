<template>
  <div class="slider">
    <div class="slider__title"><slot name="title"/></div>
    <div
      v-for="(item, index) in list"
      :key="item"
      class="slider__item"
      :class="{ slider__active: index === current }"
      @click="() => (current = index)"
    >
      <span class="item-text">{{ item }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    list: any
  }>(),
  {},
)
const current = defineModel({
  default: 0,
})
</script>

<style scoped lang="less">
@deep-pink: #ff8fab; // 选中态深粉

.slider {
  width: 200px;

  user-select: none;

  &__active {
    background: pink;
    color: white;
  }
}

// --- 左侧侧边栏 ---
.slider {
  width: 220px;
  border-right: 1px solid rgba(255, 255, 255, 0.4);
  padding: 32px 16px;
  display: flex;
  flex-direction: column;

  &__title {
    padding: 0 16px 24px;
    font-size: 18px;
    font-weight: bold;
    color: @deep-pink;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__item {
    position: relative;
    padding: 14px 24px;
    margin-bottom: 8px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 15px;
    overflow: hidden; // 确保伪元素不溢出

    // 悬停效果
    &:hover {
      background: rgba(255, 255, 255, 0.4);
      color: @deep-pink;
    }

    // ✨ 动态指示器（小粉条）
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      width: 4px;
      height: 20px; // 指示器高度
      background: @deep-pink;
      border-radius: 0 4px 4px 0;

      // 初始状态：完全缩起
      transform: translateY(-50%) scaleY(0);
      opacity: 0;

      // 贝塞尔曲线：实现果冻般的回弹效果
      transition:
        transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
        opacity 0.2s;
    }
  }

  // 选中状态
  &__active {
    background: rgba(255, 255, 255, 0.7); // 选中背景变白且更不透明
    color: @deep-pink;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(255, 183, 197, 0.15);

    // 触发指示器动画：伸展开
    &::before {
      transform: translateY(-50%) scaleY(1); // 100% 伸展
      opacity: 1;
    }
  }
}
</style>