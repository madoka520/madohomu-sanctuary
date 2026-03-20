<template>
  <div class="theme__container">
    <div class="bg">
      <div v-if="Root.currentTheme.type === 'video'">
        <video autoplay muted loop style="width: 100%; height: 100%">
          <source :src="Root.currentTheme.src" />
        </video>
      </div>
      <component
        :is="Root.currentTheme.component as object"
        v-else-if="Root.currentTheme.type === 'customer'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import useSetting from '@/hooks/useSetting.ts'
import useAudioPlayer from '@/hooks/useAudioPlayer.ts'

defineOptions({
  name: 'pre-home-theme',
})
const setting = useSetting()

const Root = (() => {
  const setWatcher = () => {
    watch(
      () => setting.theme,
      (val) => {
        const song = setting.themeList[val].song
        if (!song) return
        useAudioPlayer().playByName(song)
      },
      { immediate: true }
    )
  }
  const s = reactive({
    currentTheme: computed(() => setting.themeList[setting.theme]),
  })
  setWatcher()
  return s
})()

</script>

<style scoped>
.theme__container {
  position: fixed;
  inset: 0;
  .bg {
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}
</style>
