<template>
  <div class="mini-player" @mousedown="onMouseDown">
    <!-- 封面 -->
    <img class="cover" src="@/assets/images/madoka_pic/2.jpg" alt="" />

    <!-- 歌曲信息 -->
    <div class="info">
      <span class="title">{{ audioPlayer.currentSong.title }}</span>
      -
      <span class="artist">{{ audioPlayer.currentSong.artist }}</span>
    </div>

    <!-- 播放 / 暂停 -->
    <span class="mdi control-btn play-btn" :class="audioPlayer.playing ? 'mdi-pause-circle' : 'mdi-play-circle'" @click.stop="onToggle"></span>

    <!-- 歌单 -->
    <span class="mdi mdi-playlist-play control-btn" @click="onOpenList"></span>
  </div>
</template>

<script setup lang="ts">
import useAudioPlayer from "@/hooks/useAudioPlayer.ts"

defineOptions({
  name: "MadokaMiniPlayer",
})
const props = withDefaults(
  defineProps<{
    cover: string
  }>(),
  {
  },
)
const audioPlayer = useAudioPlayer()
const emit = defineEmits<{
  (e: "open-list"): void
  (e: "prev"): void
  (e: "next"): void
}>()

/* 点击 */
const onToggle = () => {
  if (audioPlayer.playing) {
    audioPlayer.pause()
    return
  }
  audioPlayer.resume()
}

const onOpenList = () => {
  emit("open-list")
}

/* 拖拽切歌（PC） */
let startX = 0
let dragging = false
const THRESHOLD = 50

const onMouseDown = (e: MouseEvent) => {
  startX = e.clientX
  dragging = true

  window.addEventListener("mousemove", onMouseMove)
  window.addEventListener("mouseup", onMouseUp)
}

const onMouseMove = (e: MouseEvent) => {
  if (!dragging) return
}

const onMouseUp = (e: MouseEvent) => {
  if (!dragging) return
  dragging = false

  const dx = e.clientX - startX

  if (dx > THRESHOLD) {
    audioPlayer.prev()
  } else if (dx < -THRESHOLD) {
    audioPlayer.next()
  }

  window.removeEventListener("mousemove", onMouseMove)
  window.removeEventListener("mouseup", onMouseUp)
}
</script>

<style scoped>
.mini-player {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 16px;
  background: rgba(255, 192, 203, 0.15);
  border-radius: 28px;

  height: 60px;
  justify-content: center;
  margin-left: auto;

  user-select: none;
  cursor: default;
}

/* 封面 */
.cover {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

/* 歌曲信息 */
.info {
  flex: 1;
  overflow: hidden;
}

.title {
  font-size: 14px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.artist {
  font-size: 14px;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 按钮 */
.control-btn {
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  color: pink;

  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
}

.control-btn:hover {
  transform: scale(1.1);
  opacity: 0.85;
}

.play-btn {
  font-size: 32px;
}
</style>
