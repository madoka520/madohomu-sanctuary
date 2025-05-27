<!--画册组件-->
<template>
  <div class="frame" :class="Root.class" :style="Root.style">
    {{ msg }}
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
      [props.className ?? `frame${Math.floor(Math.random() * 2)}`]: true,
      [moveClassList[`${Math.floor(Math.random() * 3)}`]]: true
    })),
    style: computed<CSSProperties>(() => {
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
        maxWidth: `${maxWidth}px`,
        maxHeight: `${maxHeight}px`,
      };
    }),
  });
  return s;
})();
</script>
<style scoped>
.frame {
  border: 10px solid #837e7a;
  min-width: 200px;
  min-height: 200px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  overflow: auto;
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
