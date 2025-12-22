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

  const jump = () => {
    const el = wrapperRef.value;
    if (!el) return;

    //先保存位置属性
    s.oldPos.transition = el.style.transition;
    s.oldPos.top = el.style.top
    s.oldPos.left = el.style.left

    el.style.transition = "none";

    const startY = el.offsetTop;
    const screenHeight = window.innerHeight;

    // 🎲 随机跳跃高度（像轻轻弹一下）
    const minJump = 20;
    const maxJump = 60;
    const jumpHeight = minJump + Math.random() * (maxJump - minJump);

    const upDuration = 200 + Math.random() * 100; // 上升时间也稍微随机
    const fallDuration = 600 + Math.random() * 200; // 下落时间

    let startTime = 0;

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 2);
    const easeIn = (t: number) => t * t;

    function frame(now: number) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;

      if (elapsed < upDuration) {
        // 向上跳
        const t = elapsed / upDuration;
        el!.style.top = `${startY - jumpHeight * easeOut(t)}px`;
      } else if (elapsed < upDuration + fallDuration) {
        // 掉下去
        const t = (elapsed - upDuration) / fallDuration;
        el!.style.top = `${startY - jumpHeight + (screenHeight + 200) * easeIn(t)}px`;
      } else {
        el!.style.display = "none";
        return;
      }

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
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
    oldPos: {
      left: '0',
      top: '0',
      transition: 'none',
    },
    jump,
  });
  init();
  return s;
})();
defineExpose({
  jump: Root.jump,
});
</script>
<style scoped lang="less">
.frame__wrapper {
  transition:
    left 0.6s ease-in-out,
    top 0.6s ease-in-out;
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
