<template>
  <div class="container">
    <div
      v-for="(item, index) in audioPlayer.songList"
      @click="audioPlayer.play(index)"
      class="song"
      :class="{ song__active: audioPlayer.current === index }"
    >
      <div style="display: flex;align-items: center;">
        <span style="padding-right: 20px;"> {{ index + 1 }}. </span>
        <madoka-icon style="margin-left: -15px;" type="playing" v-if="index === audioPlayer.current" />
        <span>{{ item.album }}-{{ item.title }} - {{ item.artist }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useAudioPlayer from "@/hooks/useAudioPlayer.ts"
import MadokaIcon from "@/components/madoka-icon/Index.vue"

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
    color: pink;
  }
}
</style>
