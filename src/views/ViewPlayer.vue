<template>
  <audio :src="audioPlayer.currentUrl" autoplay loop ref="musicRef" type="audio/webm; codecs=opus"></audio>
</template>
<script setup lang="ts">
import music from "@/assets/music/君の銀の庭.mp3"
import useAudioPlayer from "@/hooks/useAudioPlayer.ts"
const musicRef = useTemplateRef("musicRef")
const audioPlayer = useAudioPlayer()
const play = () => {
  window.removeEventListener("click", play)
  musicRef.value?.play()
}
window.addEventListener("click", play)
</script>
<style scoped></style>