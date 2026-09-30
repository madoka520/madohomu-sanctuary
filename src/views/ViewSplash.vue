<!-- 新增文件：开屏动画 —— 圆环之理（动画组件来自用户 madoka-vue 库的 MadokaLoading，发布版暂缺故本地引入） -->
<template>
  <div v-if="Root.visible" class="splash" :class="{ 'is-closing': Root.closing }" @click="Root.skip">
    <!-- 梦幻层：星尘 + 漂移光斑 -->
    <div class="splash__stars" />
    <div class="splash__aurora splash__aurora--pink" />
    <div class="splash__aurora splash__aurora--purple" />
    <madoka-loading class="splash__anim" :size="Root.animSize" />
    <div class="splash__title">円環の理</div>
    <div class="splash__sub">MadoHomu Sanctuary</div>
    <div class="splash__hint">点击任意处跳过</div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'view-splash' })
import MadokaLoading from '@/components/madoka-loading/Index.vue'

const Root = (() => {
  // 开屏节奏：动画开场编舞约 2.1s 成形(staticAt=2060)，最短展示 2.6s 后淡出
  const MIN_MS = 2600
  const FADE_MS = 600

  let dismissed = false
  let fadeTimer: ReturnType<typeof setTimeout> | undefined

  // 跳过按钮的克制感：提示文字延迟出现，动画看完它才浮出来
  const f = {
    skip: () => {
      if (dismissed) return
      dismissed = true
      f.close()
    },
    close: () => {
      clearTimeout(fadeTimer)
      s.closing = true
      setTimeout(() => {
        s.visible = false
        s.closing = false
      }, FADE_MS)
    },
  }

  const s = reactive({
    visible: true,
    closing: false,
    animSize: 260,
    ...f,
  })

  onMounted(() => {
    // 页面加载完成 + 最短展示时长都满足后才退场
    const waitLoad = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') resolve()
      else window.addEventListener('load', () => resolve(), { once: true })
    })
    const waitMin = new Promise<void>((resolve) => setTimeout(resolve, MIN_MS))
    Promise.all([waitLoad, waitMin]).then(() => {
      if (!dismissed) f.close()
    })
  })

  return s
})()
</script>

<style scoped lang="less">
// 深色夜空底：粉色发光线稿在暗底上最亮（与生日主题同源的渐变）
@night-deep: #241530;
@night-mid: #46264f;
@pink-primary: #ffb7c5;
@purple-deep: #b388eb;

.splash {
  position: fixed;
  inset: 0;
  z-index: 2147483647; // 盖住一切（含液面/粒子层），退场后才露出页面
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  // 💫 白色系梦幻：奶白粉底 + 淡紫/樱花粉的柔光云层
  background:
    radial-gradient(55% 45% at 18% 22%, rgba(213, 184, 255, 0.35), transparent 62%),
    radial-gradient(45% 40% at 82% 18%, rgba(255, 196, 215, 0.4), transparent 60%),
    radial-gradient(75% 60% at 50% 112%, rgba(255, 214, 228, 0.5), transparent 65%),
    linear-gradient(180deg, #fff8fa 0%, #fff0f5 55%, #ffe9f1 100%);
  user-select: none;
  transition: opacity 0.6s ease;

  &.is-closing {
    opacity: 0;
  }

  // ✦ 星尘：白底上用粉紫双色小点，整片轻轻呼吸
  &__stars {
    position: absolute;
    inset: 0;
    pointer-events: none;
    animation: stars-breathe 3.6s ease-in-out infinite;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 2px;
      height: 2px;
      border-radius: 50%;
      background: transparent;
      box-shadow:
        12vw 18vh 0 0 rgba(255, 133, 162, 0.55),
        22vw 8vh 1px 0 rgba(179, 136, 235, 0.6),
        34vw 30vh 0 0 rgba(255, 105, 180, 0.4),
        46vw 12vh 1px 0 rgba(167, 123, 199, 0.65),
        58vw 24vh 0 0 rgba(255, 133, 162, 0.5),
        68vw 9vh 1px 0 rgba(255, 160, 190, 0.65),
        78vw 32vh 0 0 rgba(199, 141, 255, 0.45),
        88vw 15vh 1px 0 rgba(255, 133, 162, 0.6),
        8vw 44vh 1px 0 rgba(179, 136, 235, 0.55),
        28vw 56vh 0 0 rgba(255, 105, 180, 0.45),
        42vw 68vh 1px 0 rgba(255, 160, 190, 0.5),
        62vw 58vh 0 0 rgba(199, 141, 255, 0.45),
        76vw 70vh 1px 0 rgba(255, 133, 162, 0.5),
        92vw 52vh 0 0 rgba(179, 136, 235, 0.45),
        18vw 78vh 1px 0 rgba(255, 105, 180, 0.5),
        52vw 86vh 0 0 rgba(255, 133, 162, 0.45),
        70vw 88vh 1px 0 rgba(167, 123, 199, 0.5);
    }
  }

  // 🌸 漂移光斑：两团大而模糊的粉/紫极光缓慢游走
  &__aurora {
    position: absolute;
    width: 60vmax;
    height: 60vmax;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;

    &--pink {
      top: -18vmax;
      right: -14vmax;
      background: radial-gradient(circle, rgba(255, 150, 185, 0.35), transparent 65%);
      animation: aurora-drift 14s ease-in-out infinite alternate;
    }

    &--purple {
      bottom: -20vmax;
      left: -16vmax;
      background: radial-gradient(circle, rgba(197, 160, 255, 0.32), transparent 65%);
      animation: aurora-drift 18s ease-in-out infinite alternate-reverse;
    }
  }

  &__anim {
    filter: drop-shadow(0 0 18px rgba(255, 92, 150, 0.25));
  }

  &__title {
    font-family: 'cute', 'Helvetica Rounded', Arial, sans-serif;
    font-size: clamp(26px, 3.4vw, 42px);
    font-weight: 700;
    letter-spacing: 0.35em;
    background: linear-gradient(135deg, #ff85a2 30%, @purple-deep 70%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 12px rgba(255, 133, 162, 0.35));
    animation: title-in 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.8s both;
  }

  &__sub {
    font-size: 13px;
    letter-spacing: 0.5em;
    color: rgba(190, 120, 150, 0.55);
    animation: title-in 1.4s cubic-bezier(0.22, 1, 0.36, 1) 1.2s both;
  }

  &__hint {
    position: absolute;
    bottom: 32px;
    font-size: 12px;
    color: rgba(190, 120, 150, 0.4);
    animation: hint-in 1s ease 2.2s both;
  }
}

@keyframes title-in {
  from {
    opacity: 0;
    filter: blur(14px);
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }
}

@keyframes hint-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// 星尘整体呼吸
@keyframes stars-breathe {
  0%,
  100% {
    opacity: 0.45;
  }
  50% {
    opacity: 1;
  }
}

// 极光缓慢游走
@keyframes aurora-drift {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(-6vmax, 5vmax) scale(1.15);
  }
}
</style>
