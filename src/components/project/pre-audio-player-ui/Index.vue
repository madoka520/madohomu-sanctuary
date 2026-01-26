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
          <span class="index">{{ (index + 1).toString().padStart(2, "0") }}</span>
          <madoka-icon v-if="index === audioPlayer.current" type="playing" class="playing-icon" />
          <div class="text-group">
            <span class="title">{{ item.title }}</span>
            <span class="meta">{{ item.album }} - {{ item.artist }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="player-controls">
      <div class="controls-content">
        <div class="album-cover" :class="{ 'album-cover--playing': audioPlayer.playing }">
          <img :src="currentCover" alt="cover" draggable="false" />
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
import { computed } from "vue"
import useAudioPlayer from "@/hooks/useAudioPlayer.ts"
import MadokaIcon from "@/components/madoka-icon/Index.vue"
import { getImgUrl } from "@/utils/resource.ts"

defineOptions({
  name: "pre-audio-player-ui",
})

const audioPlayer = useAudioPlayer()

// 模拟封面，如果有真实的封面字段请替换
const currentCover = computed(() => {
  return getImgUrl(`/covers/${audioPlayer.currentSong.title}.webp`)
})

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
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
  height: 70vh;
  border-radius: 16px;
  padding-bottom: 10px;
  user-select: none;
}

.song-list-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;

  .song-item {
    padding: 12px;
    margin-bottom: 8px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.5);

    &:hover {
      background: #ffe5eb;
      transform: translateX(5px);
    }

    &--active {
      background: linear-gradient(90deg, #ffdae2, #ffffff);
      box-shadow: 0 4px 12px rgba(255, 183, 197, 0.4);

      .title {
        color: #ff69b4;
        font-weight: bold;
      }
    }

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
        .title {
          font-size: 14px;
          color: #555;
        }
        .meta {
          font-size: 11px;
          color: #999;
        }
      }
    }
  }
}

.player-controls {
  padding: 15px 20px;
  background: white;
  border-top: 1px solid #ffdae2;

  .controls-content {
    display: flex;
    align-items: center;
    gap: 20px;
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
      animation: rotate-album 8s linear infinite;
    }
  }

  .progress-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;

    .time-info {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #ffb7c5;
      font-family: monospace;
    }
  }
}

/* 自定义进度条 */
.madoka-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: #ffdae2;
  border-radius: 2px;
  outline: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    background: #ff69b4;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 8px rgba(255, 105, 180, 0.5);
    border: 2px solid white;
  }
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
