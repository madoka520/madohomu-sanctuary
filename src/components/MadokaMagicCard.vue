<template>
  <div class="link-card" @click="handleClick">
    <div class="card-glass"></div>
    <div class="scan-line"></div>

    <div class="avatar-wrapper">
      <madoka-avatar :src="link.avatar" :width="248" />
    </div>

    <div class="info">
      <h3 class="name">{{ link.name }}</h3>
      <p class="desc">{{ link.description }}</p>
    </div>

    <div class="status-line"></div>
    <div class="corner-tag">SYNCED</div>
  </div>
</template>

<script setup lang="ts">
import MadokaAvatar from '@/components/MadokaAvatar.vue'

interface FriendLink {
  name: string
  url: string
  avatar: string
  description: string
}

const props = defineProps<{
  link: FriendLink
}>()
const emit = defineEmits<{
  (e: 'click'): void
}>()
const handleClick = () => emit('click')
</script>

<style lang="less" scoped>
@cyber-pink: #ff79c6;
@glass-bg: rgba(255, 255, 255, 0.05);

.link-card {
  position: relative;
  padding: 30px;
  border-radius: 4px;
  cursor: default;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;

  &:hover {
    transform: scale(1.02) skewX(-1deg);

    .scan-line {
      top: 100%;
      opacity: 1; // 悬停时变为可见
      transition:
        top 0.8s ease-out,
        opacity 0.2s; // 增加 opacity 的快速过渡
    }

    .card-glass {
      border-color: @cyber-pink;
      box-shadow: 0 0 30px rgba(255, 121, 198, 0.2);
    }
  }

  .card-glass {
    position: absolute;
    inset: 0;
    background: @glass-bg;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    z-index: -1;
    clip-path: polygon(0 0, 95% 0, 100% 15%, 100% 100%, 5% 100%, 0 85%);
  }

  .scan-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    /* 强化亮度，加入白色核心 */
    background: linear-gradient(
      90deg,
      transparent 0%,
      @cyber-pink 20%,
      #ffffff 50%,
      @cyber-pink 80%,
      transparent 100%
    );
    opacity: 0; // 初始状态完全透明，不可见
    box-shadow:
      0 0 15px @cyber-pink,
      0 0 5px #ffffff;
    pointer-events: none;
  }

  .corner-tag {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 0.6rem;
    color: @cyber-pink;
    opacity: 0.4;
  }
}
</style>