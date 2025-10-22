<!--画册组件-->
<template>
  <div class="frame__wrapper" :style="Root.wrapperStyle" :class="Root.class" ref="wrapperRef">
    <div class="frame" :style="Root.frameStyle">
      <!-- 背景视频 -->
      <video v-if="props.backgroundVideo && !hiddenVideo" class="bg-video" autoplay playsinline :src="props.backgroundVideo" muted loop />
      <slot>
        <div class="msg">
          {{ msg }}
        </div>
      </slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, type CSSProperties } from "vue";
import { animate, type AnimationParams } from "animejs";

const props = withDefaults(
  defineProps<{
    hiddenVideo?: boolean;
    msg?: string;
    className?: string;
    left?: string | number;
    top?: string | number;
    width?: number;
    height?: number;
    backgroundImage?: string;
    backgroundVideo?: string;
    zIndex?: number;
  }>(),
  {
    msg: "",
    hiddenVideo: false,
  },
);
const wrapperRef = useTemplateRef("wrapperRef");
const Root = (() => {
  /**
   * 把传入的数字自动加上百分号
   * @param pos
   */
  const toLength = (pos: unknown) => {
    if (typeof pos === "number") {
      return `${pos}%`;
    }
    return pos;
  };

  const changePos = () => {
    if (!wrapperRef.value) return;

    const el = wrapperRef.value as HTMLElement;

    /**
     * 检测两个元素是否重叠
     */
    const isOverlap = (a: DOMRect, b: DOMRect) => {
      return !(
        a.right < b.left ||
        a.left > b.right ||
        a.bottom < b.top ||
        a.top > b.bottom
      );
    };

    /**
     * 随机生成一个不会重叠的位置
     */
    const getRandomPosition = () => {
      const maxWidth = props.width ?? 12;
      const maxHeight = props.height ?? 20;
      let maxLeft = window.innerWidth - maxWidth - 100;
      if (maxLeft < 0) maxLeft = 0;
      const maxTop = window.innerHeight - maxHeight - 500;

      let left = Math.random() * maxLeft;
      let top = Math.random() * maxTop;

      const wrappers = document.querySelectorAll(".frame__wrapper") ?? [];

      // 尝试最多 20 次避免重叠
      for (let i = 0; i < 20; i++) {
        const thisRect = new DOMRect(left, top, maxWidth, maxHeight);
        let overlap = false;

        for (const w of Array.from(wrappers)) {
          if (w === el) continue;
          const rect = w.getBoundingClientRect();
          if (isOverlap(thisRect, rect)) {
            overlap = true;
            break;
          }
        }

        if (!overlap) {
          return { left, top };
        }

        // 如果重叠，则重新随机位置
        left = Math.random() * maxLeft;
        top = Math.random() * maxTop;
      }

      return { left, top };
    };

    /**
     * 执行移动动画
     */
    const move = () => {
      const { left, top } = getRandomPosition();
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;

    };

    // 初始延迟启动
    setTimeout(move, 2000 + Math.random() * 2000);
  };


  const init = () => {
    /**
     * 初始化动画 决定摆动方向
     */
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
  };
  const s = reactive({
    class: computed(() => ({
      //随机取一个frame类
      [props.className ?? `frame${Math.floor(Math.random() * 2)}`]: true,
    })),
    wrapperStyle: (() => {
      const maxWidth = props.width ?? 12;
      const maxHeight = props.height ?? 20;

      let maxLeft = window.innerWidth - maxWidth - 100;
      if (maxLeft < 0) {
        maxLeft = 0;
      }
      const maxTop = window.innerHeight - maxHeight - 500;

      const left = props.left ?? Math.random() * maxLeft;
      const top = props.top ?? Math.random() * maxTop;

      return {
        position: "absolute",
        left: toLength(left),
        top: toLength(top),
        width: toLength(maxWidth),
        height: toLength(maxHeight),
      } as CSSProperties;
    })(),
    //背景图片
    frameStyle: computed<CSSProperties>(() => ({
      backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : "",
      backgroundSize: "cover",
      backgroundPosition: "center",
      imageRendering: "crisp-edges",
    })),
    changePos
  });
  init()
  return s;
})();
defineExpose({
  changePos: Root.changePos
})
</script>
<style scoped lang="less">
.frame__wrapper {
  transition:
    left 0.3s ease-in-out,
    top 0.3s ease-in-out;
  z-index: v-bind("props.zIndex");
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
</style>
