<!-- Codex 新增文件：小圆生日主题（10/3）—— 按 madohomu.love「圆诞」原样实现：贺图淡切轮换 + 画师署名 + 动态生日计数 -->
<template>
  <swiper
    :slides-per-view="1"
    class="bg-swiper"
    :modules="[Autoplay]"
    :autoplay="{ delay: 8000, disableOnInteraction: false }"
    loop
  >
    <swiper-slide v-for="(item, index) in Root.list" :key="index" class="bg-slide">
      <div
        class="bg-image"
        :style="{
          background: `url(${getImgUrl(`themes/birthday/${item.img}`)}) center / cover no-repeat`,
          backgroundPosition: item.position,
        }"
      ></div>
      <span class="credit">画师：{{ item.artist }}</span>
    </swiper-slide>
  </swiper>

  <div class="birthdayCaption">
    <p>Happy birthday, Madoka!</p>
    <p>{{ Root.dateLine }}</p>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'madoka-birthday' })
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import { getImgUrl } from '@/utils/resource.ts'

const Root = (() => {
  // 🎂 参考站算法：2011（动画开播年）= 第 0 个生日
  const yearsOld = new Date().getFullYear() - 2011

  const s = reactive({
    dateLine: `10/3/${new Date().getFullYear()} - Madoka's ${yearsOld}th birthday`,
    // 贺图与画师信息来自 madohomu.love 生日主题（assets 分支）
    list: [
      { img: 'mainbg1.jpg', artist: '八重ハルラ', position: '50% 50%' },
      { img: 'mainbg2.jpg', artist: 'ほんわか紳士', position: '50% 50%' },
      { img: 'mainbg3.jpg', artist: 'mizuki', position: '35% 50%' },
      { img: 'mainbg4.jpg', artist: 'ゆきねこ', position: '65% 50%' },
    ],
  })
  return s
})()
</script>

<style lang="less" scoped>
@caption-pink: #ff729c;

.bg-swiper {
  width: 100%;
  height: 100%;

  .bg-slide {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background: #241530; // 图片加载前的深色底

    .bg-image {
      position: absolute;
      inset: 0;
      filter: brightness(0.88);
      transform: scale(1.2); // 默认放大，激活时缓慢缩回（kami 同款 Ken Burns 韵律）
      backface-visibility: hidden;
      will-change: transform;
    }

    &.swiper-slide-active .bg-image {
      animation: scale-down 8s ease-out forwards;
    }

    // 画师署名：角落里小小的感谢
    .credit {
      position: absolute;
      right: 12px;
      bottom: 10px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.55);
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
    }
  }
}

// 🎂 中央祝福：参考站样式 —— 粉色粗斜体大字 + 次行常规小字
.birthdayCaption {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  user-select: none;

  p {
    margin: 0;
    color: @caption-pink;
    font-family: 'cute', 'comic sans ms', cursive;
    font-weight: bold;
    font-style: italic;
    font-size: min(6.5vw, 8vh);
    text-align: center;
    text-shadow: 0 0 0.25em rgba(0, 0, 0, 0.9);
  }

  p:last-child {
    margin-top: 1.2vh;
    font-size: min(3.4vw, 3.6vh);
    font-weight: normal;
  }
}
@keyframes scale-down {
  from { transform: scale(1.25); }
  to { transform: scale(1); }
}
</style>
