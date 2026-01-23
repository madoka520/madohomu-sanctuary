<template>
  <audio
    :src="audioPlayer.currentUrl"
    autoplay
    :ref="audioPlayer.ref.set"
    @ended="audioPlayer.next"
    type="audio/webm; codecs=opus"
  ></audio>
</template>
<script setup lang="ts">
import useAudioPlayer from "@/hooks/useAudioPlayer.ts"
const audioPlayer = useAudioPlayer()
const play = () => {
  window.removeEventListener("click", play)
  audioPlayer.play()
}
window.addEventListener("click", play)
</script>
<style scoped></style>
