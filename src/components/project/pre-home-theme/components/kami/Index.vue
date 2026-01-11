<template>
  <swiper :slides-per-view="1" :loop="false" class="bg-swiper" @slideChange="Root.onSlideChange" ref="swiperRef" @swiper="onSwiper">
    <swiper-slide v-for="(item, index) in Root.list" :key="index" class="bg-slide">
      <div class="bg-image" :style="{ background: `url(${getImgUrl(`kami/kami_${index + 1}.webp`)}) center / cover no-repeat` }"></div>

      <div class="message-container">
        <div v-for="(line, lineIdx) in item.message" :key="lineIdx" class="message-line">
          <span v-for="(char, charIdx) in line.split('')" :key="charIdx" class="char" :style="{ '--delay': `${lineIdx * 2.0 + charIdx * 0.24}s` }">
            {{ char === " " ? "\u00A0" : char }}
          </span>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import { Swiper, SwiperSlide } from "swiper/vue"
import emitter from "@/utils/emitter"
import { getImgUrl } from "@/utils/resource.ts"
import useAudioPlayer from "@/hooks/useAudioPlayer.ts"

const swiperRef = useTemplateRef("swiperRef")
const Root = (() => {
  const onSlideChange = (swiper: any) => {
    s.current = swiper.activeIndex + 1
  }
  useIntersectionObserver(
    swiperRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        setWatcher()
      }
    },
    { threshold: 0.1 },
  )
  const setWatcher = () => {
    watch(
      () => s.current,
      (value) => {
        useAudioPlayer().playByName(s.list[value - 1].song!)
      },
      { immediate: true },
    )
  }

  const s = reactive({
    current: 1,
    list: [
      {
        message: [
          "Darkness cannot drive out darkness",
          "only light can do that",
          "Hate cannot drive out hate",
          "only love can do that.",
          "Your sin , I bear",
        ],
        song: "never leave you alone",
      },
      {
        message: ["奇跡も", "魔法も", "あるんだよ", "後悔なんて、あるわけない"],
        song: "魔法少女のテーマ",
      },
      {
        message: ["don't forget", "always somewhere", "someone is fighting for you", "as long as you remember her", "You are not alone."],
        song: "Sagitta luminis",
      },
      {
        message: [
          "夢はこの部屋の中で",
          "優しい歌をずっと君に歌っていた",
          "何がほんとのことなの",
          "一番強く信じられる世界を追いかけて",
          "君の銀の庭へ",
        ],
        song: "君の銀の庭 _より",
      },
      {
        message: ["如果有人告诉我", "怀有希望是一件错误的事情", "我将无论多少次都会出言反驳", "不管何时我都能这样坚持。"],
        song: "Decretum",
      },
    ],
    onSlideChange,
  })
  setWatcher()
  return s
})()

const swiperInstance = ref<any>(null)

// 在模板中绑定 @swiper="onSwiper"
const onSwiper = (swiper: any) => {
  swiperInstance.value = swiper
}

onMounted(() => {
  // 2️⃣ 监听事件总线
  emitter.on("bg-slide-next", () => {
    swiperInstance.value?.slideNext()
  })
  emitter.on("bg-slide-prev", () => swiperInstance.value?.slidePrev())
})

onBeforeUnmount(() => {
  emitter.off("bg-slide-next")
  emitter.off("bg-slide-prev")
})
</script>

<style lang="less" scoped>
.bg-swiper {
  width: 100%;
  height: 100%;
  z-index: -1;

  .bg-slide {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden; // 必须：防止背景图放大超出边界
    display: flex;
    align-items: center;

    // 背景图层
    .bg-image {
      position: absolute;
      // ✨ 核心代码：调暗图片
      // 0.7 代表 70% 的亮度，数值越小越暗。建议范围 0.4 - 0.8
      filter: brightness(0.9);
      inset: 0;
      z-index: 0;
      transform: scale(1.2); // 默认放大
      // 2️⃣ 开启硬件加速补丁：防止动画时文字或图片发虚
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      will-change: transform;
      // 3️⃣ 修正图像渲染算法，保持平滑
      image-rendering: -webkit-optimize-contrast;
    }

    .message-container {
      position: relative;
      z-index: 2;
      padding-left: 20%;
      user-select: none;

      .char {
        display: inline-block;
        font-size: 2.2rem;
        color: #ffffff;
        text-shadow:
          0 2px 4px rgba(0, 0, 0, 0.8),
          0 0 15px rgba(255, 255, 255, 0.3);
        opacity: 0;
        filter: blur(12px);
        transform: translateY(15px);
      }
    }

    // ✨ 当 Slide 激活时，背景缩小，文字浮现
    &.swiper-slide-active {
      .bg-image {
        animation: scale-down 8s ease-out forwards; // 背景由大变小，8秒非常舒缓
      }
      .char {
        animation: dream-in 2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        animation-delay: var(--delay);
      }
    }
  }
}

// 背景缩放动画
@keyframes scale-down {
  from {
    transform: scale(1.25);
  }
  to {
    transform: scale(1);
  }
}

// 文字梦幻进入动画
@keyframes dream-in {
  0% {
    opacity: 0;
    filter: blur(20px);
    transform: translateY(20px) scale(0.8);
    letter-spacing: 12px;
  }
  40% {
    opacity: 0.5;
    filter: blur(8px);
  }
  100% {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0) scale(1);
    letter-spacing: 2px;
  }
}
</style>
