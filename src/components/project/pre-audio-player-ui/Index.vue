<template>
  <div class="container">
    <div
      v-for="(item, index) in audioPlayer.songList"
      @click="audioPlayer.play(index)"
      class="song"
      :class="{ song__active: audioPlayer.current === index }"
    >
      {{ index + 1 }}. {{item.album}}-{{ item.title }} - {{item.artist}}
    </div>
  </div>
</template>

<script setup lang="ts">
import useAudioPlayer from "@/hooks/useAudioPlayer.ts"

defineOptions({
  name: "pre-audio-player-ui",
})

const audioPlayer = useAudioPlayer()
</script>

<style scoped>
.container {
  .song {
  }
  .song__active {
    background: pink;
    color: white;
  }
}
</style>
