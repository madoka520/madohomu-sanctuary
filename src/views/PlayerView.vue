<template>
  <audio :src="music" autoplay loop ref="musicRef"></audio>
</template>
<script setup lang="ts">
import music from "@/assets/musics/君の銀の庭.mp3";
const musicRef = useTemplateRef("musicRef");
const play = () => {
  window.removeEventListener("click", play)
  musicRef.value?.play();
};
window.addEventListener("click", play);
</script>
<style scoped></style>