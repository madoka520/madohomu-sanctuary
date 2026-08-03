<template>
  <div class="theme-select-container">
    <div
      v-for="(item, index) in setting.themeList"
      :key="index"
      class="theme-option"
      :class="{
        'is-loading': item.type === 'video' && videoPreload.cacheStatus[item.src!] === CacheStatus.Loading,
        'is-error': item.type === 'video' && videoPreload.cacheStatus[item.src!] === CacheStatus.Error,
        'is-active': setting.theme === index,
      }"
      @click="() => handleClick(index, item)"
    >
      <div class="theme-cover">
        <img :src="item.cover" alt="" />
      </div>
      <div class="name">{{ item.name }}</div>

      <!-- [Ethan] 视频主题已缓存标记 -->
      <div
        v-if="item.type === 'video' && videoPreload.cacheStatus[item.src!] === CacheStatus.Cached"
        class="cached-badge"
      >
        <i class="mdi mdi-check-circle" />
      </div>

      <!-- [Ethan] 缓存未完成 → 进度条遮罩 -->
      <div
        v-if="item.type === 'video' && videoPreload.cacheStatus[item.src!] === CacheStatus.Loading"
        class="card-overlay"
      >
        <i class="mdi mdi-progress-download icon-download" />
        <MadokaProgressBar indeterminate class="card-progress" />
        <span class="overlay-text">加载中…</span>
      </div>

      <!-- [Ethan] 缓存失败 → 重载图标 -->
      <div
        v-if="item.type === 'video' && videoPreload.cacheStatus[item.src!] === CacheStatus.Error"
        class="card-overlay card-overlay--error"
        @click.stop="() => videoPreload.retryPreload(item.src!)"
      >
        <i class="mdi mdi-refresh icon-retry" />
        <span class="overlay-text">点击重试</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import useSetting from "@/hooks/useSetting.ts"
import useVideoPreload, { CacheStatus } from '@/hooks/useVideoPreload.ts'
import MadokaProgressBar from '@/components/MadokaProgressBar.vue'

const setting = useSetting()
const videoPreload = useVideoPreload()

const handleClick = (index: number, item: (typeof setting.themeList)[number]) => {
  // [Ethan] 视频主题加载中 → 禁止切换
  if (item.type === 'video' && videoPreload.cacheStatus[item.src!] === CacheStatus.Loading) return
  setting.theme = index
}
</script>

<style scoped lang="less">
@madoka-pink: #ffb7ce;
@madoka-pink-deep: #ff69b4;
@bg-card: rgba(255, 183, 206, 0.06);
@bg-card-hover: rgba(255, 183, 206, 0.12);
@bg-card-active: rgba(255, 183, 206, 0.15);

.theme-select-container {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  padding: 8px 0;
}

.theme-option {
  position: relative;
  width: 168px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px 12px 12px;
  border-radius: 12px;
  background: @bg-card;
  border: 2px solid transparent;
  cursor: pointer;
  user-select: none;
  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.2s ease;

  &:hover {
    background: @bg-card-hover;
    transform: translateY(-2px);
  }

  // [Ethan] 当前选中主题
  &.is-active {
    background: @bg-card-active;
    border-color: @madoka-pink;
    box-shadow:
      0 0 16px rgba(255, 183, 206, 0.25),
      inset 0 0 0 1px rgba(255, 183, 206, 0.1);
    transform: translateY(-3px);

    .name {
      color: @madoka-pink;
    }
  }

  // [Ethan] 加载中 — 禁止点击
  &.is-loading {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.theme-cover {
  width: 120px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);

  img {
    width: auto;
    height: 100%;
    max-width: 100%;
    object-fit: cover;
    transition: transform 0.35s ease;
  }

  .theme-option:hover & img {
    transform: scale(1.08);
  }
}

.name {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  line-height: 1.4;
  transition: color 0.25s ease;
  word-break: break-all;
}

// [Ethan] 已缓存标记
.cached-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;

  .mdi {
    font-size: 16px;
    color: @madoka-pink;
    filter: drop-shadow(0 0 4px rgba(255, 183, 206, 0.5));
  }
}

// [Ethan] 卡片遮罩层
.card-overlay {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  z-index: 2;
  pointer-events: none;

  .icon-download {
    font-size: 24px;
    color: @madoka-pink;
    animation: pulse-download 1.5s ease-in-out infinite;
  }

  .overlay-text {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 2px;
  }
}

// [Ethan] 错误遮罩 — 可点击重试
.card-overlay--error {
  pointer-events: auto;
  cursor: pointer;

  .icon-retry {
    font-size: 28px;
    color: @madoka-pink;
    transition: transform 0.35s ease;
  }

  &:hover .icon-retry {
    transform: rotate(180deg);
  }

  &:hover .overlay-text {
    color: @madoka-pink;
  }

  .overlay-text {
    transition: color 0.25s ease;
  }
}

.card-progress {
  width: 60%;
}

@keyframes pulse-download {
  0%, 100% { opacity: 0.5; transform: translateY(0); }
  50%      { opacity: 1;   transform: translateY(-3px); }
}
</style>
