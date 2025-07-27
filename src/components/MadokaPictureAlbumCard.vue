<!--画册组件-->
<template>
  <div class="frame__wrapper" :style="Root.wrapperStyle" :class="Root.class" ref="wrapperRef">
    <div class="frame" :style="Root.frameStyle">
      <!-- 背景视频 -->
      <video v-if="props.backgroundVideo" class="bg-video" autoplay playsinline :src="props.backgroundVideo" muted loop />
      <slot>
        <div class="msg">
          {{ msg }}
        </div>
      </slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { type CSSProperties } from "vue";
import { animate, type AnimationParams, stagger, text } from "animejs";

const props = withDefaults(
  defineProps<{
    msg?: string;
    className?: string;
    left?: number;
    top?: number;
    backgroundImage?: string;
    backgroundVideo?: string;
  }>(),
  {
    msg: "",
  },
);
const wrapperRef = useTemplateRef("wrapperRef");
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
      // [moveClassList[`${Math.floor(Math.random() * 3)}`]]: true
    })),
    wrapperStyle: (() => {
      const maxWidth = buildLength();
      const maxHeight = buildLength();

      let maxLeft = window.innerWidth - maxWidth - 100;
      if (maxLeft < 0) {
        maxLeft = 0;
      }
      const maxTop = window.innerHeight - maxHeight - 500;

      const left = props.left ?? Math.random() * maxLeft;
      const top = props.top ?? Math.random() * maxTop;

      return {
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
        width: `${maxWidth}px`,
        height: `${maxHeight}px`,
      } as CSSProperties;
    })(),
    //背景图片
    frameStyle: computed<CSSProperties>(() => ({
      backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : "",
      backgroundSize: "cover",
      backgroundPosition: "center",
      imageRendering: "crisp-edges",
    })),
  });
  onMounted(() => {
    // 随机选择方向和偏移量
    const moveType = Math.floor(Math.random() * 3) as 0 | 1 | 2;
    const delta = 10;

    const moveMap: Partial<AnimationParams>[] = [
      { translateX: [0, -delta, 0] },
      { translateY: [0, -delta, 0] },
      {
        translateX: [0, delta, 0],
        translateY: [0, -delta, 0],
      },
    ];

    animate(wrapperRef.value!, {
      ...moveMap[moveType],
      duration: 5000,
      direction: "alternate",
      easing: "easeInOutSine",
      loop: true,
    });
  });
  return s;
})();
</script>
<style scoped lang="less">
.frame__wrapper {
  max-width: 200px;
  max-height: 200px;
  transition:
    left 0.3s ease-in-out,
    top 0.3s ease-in-out;

  &:hover {
    z-index: 10;
  }

  .frame {
    border: 10px solid #837e7a;
    background: white;
    width: 100%;
    height: 100%;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    transition:
      transform 0.3s ease,
      filter 0.3s ease,
      box-shadow 0.3s ease;

    //背景视频
    .bg-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      top: 0;
      left: 0;
      z-index: 0;
      pointer-events: none;
      border-radius: inherit;
    }

    .msg {
      overflow: auto;
      height: 100%;
      width: 100%;
    }

    &:hover {
      transform: scale(1.1); // 放大到 105%
      box-shadow:
        0 12px 24px rgba(0, 0, 0, 0.3),
        0 0 12px rgba(255, 200, 255, 0.4); // 柔光边框
    }
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
