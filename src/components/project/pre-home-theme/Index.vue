<template>
  <div class="theme__container">
    <div class="bg">
      <!--
      [原代码] 直接用 <video> + <source> 请求 Gitee API URL，
      Gitee API 返回的是 JSON 不是 M3U8 内容，所以无法播放。
      <div v-if="Root.currentTheme.type === 'video'">
        <madoka-hls-player :src="Root.currentTheme.src"/>
        <video autoplay muted loop style="width: 100%; height: 100%">
          <source
            :src="'https://gitee.com/api/v3/projects/ultimate_madoka/madohomu-sanctuary/tree/master/public/dev-cdn/videos/madoka-op-muted/playlist.m3u8'"
          />
        </video>
      </div>
      -->

      <!-- [Ethan] 改用 GiteeVideoPlayer 组件，内部处理 API JSON 解析 → Blob URL -->
      <gitee-video-player v-if="Root.currentTheme.type === 'video'" :src="Root.currentTheme.src" />

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
// [原代码] MadokaHlsPlayer 暂不用，保留引用
import MadokaHlsPlayer from '@/components/MadokaHlsPlayer.vue'
// [Ethan] GiteeVideoPlayer - 从 Gitee API 拉取 M3U8 → 解析 JSON → Blob URL 播放
import GiteeVideoPlayer from '@/components/GiteeVideoPlayer.vue'

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
      { immediate: true },
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
