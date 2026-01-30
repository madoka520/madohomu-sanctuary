<template>
  <div class="mini-player" ref="miniPlayerRef">
    <!-- 封面 -->
    <img class="cover" :src="getImgUrl(`/covers/${audioPlayer.currentSong.title}.webp`)" alt="" />

    <!-- 歌曲信息 -->
    <div class="info">
      <span class="title">{{ audioPlayer.currentSong.title }}</span>
      -
      <span class="artist">{{ audioPlayer.currentSong.artist }}</span>
    </div>

    <!-- 播放 / 暂停 -->
    <span class="mdi control-btn play-btn" :class="audioPlayer.playing ? 'mdi-pause-circle' : 'mdi-play-circle'" @click.stop="onToggle"></span>

    <!-- 歌单 -->
<!--    <span class="mdi mdi-playlist-play control-btn"></span>-->
    <madoka-dialog v-model="Dialog.preAudioPlayerUi.opened" title="" height="400px" width="600px" :footer="false">
      <pre-audio-player-ui />
    </madoka-dialog>
  </div>
</template>

<script setup lang="ts">
import useAudioPlayer from "@/hooks/useAudioPlayer.ts"
import { getImgUrl } from "@/utils/resource.ts"
import MadokaDialog from "@/components/MadokaDialog.vue"
import PreAudioPlayerUi from "@/components/project/pre-audio-player-ui/Index.vue"
import { type FullGestureState, useDrag } from "@vueuse/gesture"
defineOptions({
  name: "MadokaMiniPlayer",
})
const audioPlayer = useAudioPlayer()
const miniPlayerRef = useTemplateRef("miniPlayerRef")
const Dialog = (() => {
  const open = (name: string, e?: Event) => {
    switch (name) {
      case "preAudioPlayerUi": {
      }
    }
    s[name].opened = true
  }
  const s = reactive({
    preAudioPlayerUi: {
      opened: false,
    },
    open,
  })
  return s
})()
/* 点击 */
const onToggle = () => {
  if (audioPlayer.playing) {
    audioPlayer.pause()
    return
  }
  audioPlayer.resume()
}

const dragHandler = (state: FullGestureState<"drag">) => {
  const swipeX = state.swipe[0] // 横向滑动
  const tap = state.tap // 是否点击
  const el = state.event!.target as HTMLElement
  if (tap && !el.closest(".control-btn")) {
    Dialog.open("preAudioPlayerUi")
  } else if (swipeX === 1) {
    audioPlayer.prev()
  } else if (swipeX === -1) {
    audioPlayer.next()
  }
}
useDrag(dragHandler, {
  domTarget: miniPlayerRef,
  filterTaps: true, // 点击不会触发 swipe 逻辑
})
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
