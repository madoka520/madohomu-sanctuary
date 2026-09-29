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
      <!-- 原代码 - Codex 保留（常驻显示，下载完成后角标不会消失） -->
      <!-- <div
        v-if="item.type === 'video' && videoPreload.cacheStatus[item.src!] === CacheStatus.Cached"
        class="cached-badge"
      >
        <i class="mdi mdi-check-circle" />
      </div> -->
      <!-- Codex 新增开始 —— 缓存完成的勾只在完成瞬间展示 2.5s，随后自动淡出 -->
      <div
        v-if="item.type === 'video' && videoPreload.cacheStatus[item.src!] === CacheStatus.Cached && cachedBadgeVisible[item.src!]"
        class="cached-badge"
      >
        <i class="mdi mdi-check-circle" />
      </div>
      <!-- Codex 新增结束 -->

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

// Codex 新增开始 —— "已缓存"角标短暂展示逻辑：只在 Loading→Cached 的完成瞬间亮起，2.5s 后熄灭；
// 页面加载时本来就已缓存的视频（无 Loading 前态）不再打扰
const cachedBadgeVisible = reactive<Record<string, boolean>>({})
watch(
  () => ({ ...videoPreload.cacheStatus }),
  (cur, prev) => {
    for (const src of Object.keys(cur)) {
      if (cur[src] === CacheStatus.Cached && prev && prev[src] === CacheStatus.Loading) {
        cachedBadgeVisible[src] = true
        setTimeout(() => {
          cachedBadgeVisible[src] = false
        }, 2500)
      }
    }
  },
)
// Codex 新增结束
</script>

<style scoped lang="less">
/* 原代码 - Codex 保留（旧版主题卡片样式：暗色半透明卡片 + 小尺寸封面，整体偏素）
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
*/

/* Codex 新增开始 —— 新版主题卡片：无背景填充 + 直角细边框，选中态粉色光晕 */
@pink-primary: #ffb7c5;
@pink-dark: #ff85a2;
@rose-text: #8a5d6f;
// 兼容下方旧角标/遮罩样式的变量别名（原定义已随旧样式注释）
@madoka-pink: @pink-primary;

.theme-select-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 18px;
  padding: 10px 4px 6px;
}

.theme-option {
  position: relative;
  width: 176px;
  padding: 10px 10px 12px;
  background: transparent; // 无背景填充，靠边框成形
  border: 1.5px solid rgba(255, 183, 197, 0.45);
  border-radius: 0; // 直角
  cursor: pointer;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: rgba(255, 133, 162, 0.75);
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(255, 183, 197, 0.35);

    .theme-cover img {
      transform: scale(1.06);
    }
  }

  // 按下时的物理感
  &:active {
    transform: translateY(-1px) scale(0.98);
  }

  // 当前选中：粉色实线描边 + 光晕
  &.is-active {
    border-color: @pink-dark;
    box-shadow:
      0 0 0 1px rgba(255, 133, 162, 0.3),
      0 8px 24px rgba(255, 133, 162, 0.35);

    .name {
      color: @pink-dark;
      font-weight: 600;
    }
  }

  &.is-loading {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.75;
  }
}

// 封面：铺满卡片宽度，3:2 取景，同样直角无底色
.theme-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  background: transparent;
  border: none;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  }
}

.name {
  margin-top: 10px;
  font-size: 13px;
  text-align: center;
  line-height: 1.5;
  color: @rose-text;
  word-break: break-all;
  transition: color 0.25s ease;
}
/* Codex 新增结束 */

// [Ethan] 已缓存标记
.cached-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
  animation: badge-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);

  .mdi {
    font-size: 16px;
    color: @madoka-pink;
    filter: drop-shadow(0 0 4px rgba(255, 183, 206, 0.5));
  }
}

// Codex 新增开始 —— 角标弹入：完成瞬间的确认感
@keyframes badge-pop {
  from {
    opacity: 0;
    transform: scale(0.4);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
// Codex 新增结束

// [Ethan] 卡片遮罩层
.card-overlay {
  position: absolute;
  inset: 0;
  border-radius: 0; // Codex 修改：匹配新版卡片直角
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
