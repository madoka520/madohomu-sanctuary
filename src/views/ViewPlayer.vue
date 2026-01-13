<template>
  <audio
    :src="audioPlayer.currentUrl"
    autoplay
    :ref="audioPlayer.ref.set"
    @ended="audioPlayer.next"
    type="audio/webm; codecs=opus"
    @timeupdate="audioPlayer.timeupdate"
  ></audio>
</template>
<script setup lang="ts">
import music from "@/assets/music/君の銀の庭.mp3"
import useAudioPlayer from "@/hooks/useAudioPlayer.ts"
const audioPlayer = useAudioPlayer()
const play = () => {
  window.removeEventListener("click", play)
  audioPlayer.play()
}
window.addEventListener("click", play)
</script>
<style scoped></style>
