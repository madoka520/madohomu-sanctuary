<template>
  <div class="player-wrapper">
    <div class="song-list-container">
      <div
        v-for="(item, index) in audioPlayer.songList"
        :key="index"
        @click="audioPlayer.play(index)"
        class="song-item"
        :class="{ 'song-item--active': audioPlayer.current === index }"
      >
        <div class="song-info">
          <span class="index">{{ (index + 1).toString().padStart(2, '0') }}</span>
          <madoka-icon v-if="index === audioPlayer.current" type="playing" class="playing-icon" />
          <div class="text-group" :class="{ current: index === audioPlayer.current }">
            <span class="title">{{ item.title }}</span>
            <span class="meta">{{ item.album }} - {{ item.artist }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- =========start========== 控制栏上沿:◆ 宝石饰件分隔线(全局 gem.less),替代素色 border-top -->
    <div class="gem-divider gem-divider--tight">
      <span class="line"></span>
      <span class="gem"></span>
      <span class="line line--rev"></span>
    </div>
    <!-- ========end======== -->

    <div class="player-controls">
      <div class="controls-content">
        <div class="album-cover" :class="{ 'album-cover--playing': audioPlayer.playing }">
          <img :src="currentCover" alt="cover" draggable="false" />
        </div>
        <div class="controls-info">
          <div>
            {{ audioPlayer.currentSong.title }}
          </div>
          <div class="artist">
            {{ audioPlayer.currentSong.artist }}
          </div>
        </div>
        <div class="progress-section">
          <div class="time-info">
            <span>{{ formatTime(audioPlayer.currentTime) }}</span>
            <span>{{ formatTime(audioPlayer.currentSong.duration) }}</span>
          </div>
          <input
            type="range"
            class="madoka-slider"
            :value="audioPlayer.currentTime"
            :max="audioPlayer.currentSong.duration"
            @input="handleProgressInput"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useAudioPlayer from '@/hooks/useAudioPlayer.ts'
import MadokaIcon from '@/components/madoka-icon/Index.vue'
import { getImgUrl } from '@/utils/resource.ts'

defineOptions({
  name: 'pre-audio-player-ui',
})

const audioPlayer = useAudioPlayer()

// 模拟封面，如果有真实的封面字段请替换
const currentCover = computed(() => {
  return getImgUrl(`/covers/${audioPlayer.currentSong.title}.webp`)
})

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const handleProgressInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  audioPlayer.seek(target.value)
}
</script>

<style scoped lang="less">
.player-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  // ⚠️ 70vh 是承重墙,不能改成 100%:弹窗 overlay 高度是 auto(max-height 86vh),main 也是
  // height:auto + overflow:hidden——百分比高度解析不了会退回内容高度,列表不约束、
  // 底栏被 overflow:hidden 裁掉且无法滚动(2026-11-05 实测踩坑)。必须给确定高度,
  // 70vh + main 内边距 28px 恒小于 86vh 上限,各尺寸视口下都成立
  height: 70vh;
  // 原代码 - 保留(圆角由弹窗外框 radius 负责,内容层不再自带)
  // border-radius: 24px;
  // corner-shape: superellipse(1.333);
  width: 100%;
  // padding-bottom: 10px;
  user-select: none;
}

.song-list-container {
  flex: 1;
  overflow-y: auto;
  padding: 4px 8px 4px 2px;
  scrollbar-gutter: stable;

  .song-item {
    // =========start========== 白色药丸卡改细线行:透明底 + 底部细粉线,与账号设置行同语言
    padding: 12px 10px;
    // 原代码 - 保留(白卡形态)
    // margin-bottom: 8px;
    // border-radius: 10px;
    // background: rgba(255, 255, 255, 0.5);
    // box-shadow: 0 2px 8px rgba(255, 183, 197, 0.3);
    border-bottom: 1px solid rgba(255, 183, 197, 0.28);
    background: transparent;
    border-radius: 0;
    transition: transform 0.3s ease, background 0.3s ease;
    will-change: transform;

    font-size: 14px;

    &:hover {
      background: rgba(255, 183, 206, 0.1);
      transform: translateX(4px);
    }
    .title {
      color: #5f3a49;
      font-size: 14px;
      font-weight: bold;
    }
    .meta {
      color: rgba(95, 58, 73, 0.55);
      font-size: 11px;
    }
    &--active {
      // 原代码 - 保留(白底渐变卡)
      // background: linear-gradient(90deg, #ffdae2, #ffffff);
      // box-shadow: 0 4px 12px rgba(255, 183, 197, 0.4);
      background: linear-gradient(90deg, rgba(255, 133, 162, 0.15), transparent);

      .title {
        color: #ff69b4;
        font-size: 14px;
        font-weight: bold;
        text-shadow: 0 0 8px rgba(255, 105, 180, 0.35);
      }
      .meta {
        color: rgba(255, 133, 162, 0.75);
        font-size: 11px;
      }

      &:hover {
        background: linear-gradient(90deg, rgba(255, 133, 162, 0.22), transparent);
        transform: translateX(4px);
      }
    }
    // ========end========

    .song-info {
      display: flex;
      align-items: center;
      gap: 12px;

      .index {
        font-family: monospace;
        color: #ffb7c5;
        font-size: 14px;
      }
      .playing-icon {
        filter: drop-shadow(0 0 2px #ffb7c5);
      }

      .text-group {
        display: flex;
        flex-direction: column;
      }
    }
  }
}

.player-controls {
  // =========start========== 白色大圆角卡改平铺底栏:细线与歌单分隔,透明底融入弹窗
  // 原代码 - 保留(白色超椭圆卡形态)
  // margin: 0 10px 10px 10px;
  // background: white;
  // border-radius: 22px;
  // corner-shape: superellipse(1.333);
  // box-shadow: 0 4px 12px rgba(255, 183, 197, 0.3);
  padding: 14px 8px 4px;
  // 原代码 - 保留(素色顶线,已由上方 ◆ 宝石分隔线替代)
  // border-top: 1px solid rgba(255, 183, 197, 0.45);
  background: transparent;
  // ========end========

  .controls-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .album-cover {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 3px solid #ffb7c5;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(255, 183, 197, 0.5);
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &--playing {
      //animation: rotate-album 8s linear infinite;
    }
  }

  .controls-info {
    font-size: 13px;
    color: #5f3a49;
    flex-shrink: 0;
    .artist {
      color: rgba(95, 58, 73, 0.55);
    }
  }
  .progress-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;

    .time-info {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #ff85a2;
      font-family: monospace;
    }
  }
}

/* 自定义进度条 */
.madoka-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  background: rgba(255, 183, 213, 0.45);
  border-radius: 2px;
  outline: none;

  &::-webkit-scrollbar {
    display: none;
  }

  // 原代码 - 保留(选择器写错:range 的滑块是 slider-thumb,scrollbar-thumb 从未生效过)
  // &::-webkit-scrollbar-thumb {
  //   -webkit-appearance: none;
  //   width: 12px;
  //   height: 12px;
  //   background: #ff69b4;
  //   border-radius: 50%;
  //   box-shadow: 0 0 8px rgba(255, 105, 180, 0.5);
  //   border: 2px solid white;
  // }

  // =========start========== 真正的滑块:粉芯白描边 + 柔光,hover 轻微放大
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    background: #ff69b4;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(255, 105, 180, 0.5);
    border: 2px solid white;
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  &:hover::-webkit-slider-thumb {
    transform: scale(1.2);
  }
  // ========end========
}

@keyframes rotate-album {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
