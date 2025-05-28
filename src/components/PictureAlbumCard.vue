<!--画册组件-->
<template>
  <div class="frame__wrapper" :style="Root.wrapperStyle" :class="Root.class" >
    <div class="frame" >
      {{ msg }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, type CSSProperties } from "vue";

const props = withDefaults(
  defineProps<{
    msg: string;
    className?: string;
  }>(),
  {
    msg: "",
  },
);
const Root = (() => {
  const moveClassList = ["move__horizontally", "move__vertically", "move__diagonal"];
  /**
   * 生成180到200之内的随机长度
   */
  const buildLength = () => Math.floor(Math.random() * (200 - 180 + 1)) + 180;
  const s = reactive({
    class: computed(() => ({
      //随机取一个frame类
      [props.className ?? `frame${Math.floor(Math.random() * 2)}`]: true,
      //随机移动方式
      [moveClassList[`${Math.floor(Math.random() * 3)}`]]: true
    })),
    wrapperStyle: computed<CSSProperties>(() => {
      const maxWidth = buildLength();
      const maxHeight = buildLength();

      let maxLeft = window.innerWidth - maxWidth - 100;
      if (maxLeft < 0) {
        maxLeft = 0;
      }
      const maxTop = window.innerHeight - maxHeight -500;

      const left = Math.random() * maxLeft;
      const top = Math.random() * maxTop;

      return {
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
        width: `${maxWidth}px`,
        height: `${maxHeight}px`,
      };
    }),
  });
  return s;
})();
</script>
<style scoped lang="less">
.frame__wrapper {
  max-width: 200px;
  max-height: 200px;
  &:hover {
    z-index: 10;
  }

  .frame {
    border: 10px solid #837e7a;
    width: 100%;
    height: 100%;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    overflow: auto;
    transition: transform 0.3s ease, filter 0.3s ease, box-shadow 0.3s ease;
  }
  .frame:hover {
    transform: scale(1.1); // 放大到 105%
    filter: brightness(1.3); // 稍微提亮
    box-shadow:
      0 12px 24px rgba(0, 0, 0, 0.3),
      0 0 12px rgba(255, 200, 255, 0.4); // 柔光边框
  }
}




.frame0 {
  border-radius: 10px;
}

.frame1 {
}

.move__horizontally {
  animation: horizontallyMove 5s ease-in-out infinite;
}

.move__vertically {
  animation: verticalMove 5s ease-in-out infinite;
}

.move__diagonal {
  animation: diagonalMove 5s ease-in-out infinite;
}

/* 动画定义 */
@keyframes horizontallyMove {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-10px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes verticalMove {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes diagonalMove {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(10px, -10px);
  }
  100% {
    transform: translate(0, 0);
  }
}
</style>
