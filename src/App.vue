<template>
  <!-- =========start========== 开屏：圆环之理动画，退场后才露出主页面 -->
  <view-splash />
  <!-- ========end======== -->
  <view-home />
</template>
<script setup lang="ts">
import ViewHome from "@/views/view-home/Index.vue"
import ViewSplash from "@/views/ViewSplash.vue"
import useOnce from "@/components/useOnce.ts"
import screenTip from "@/components/project/tips/screenTip.tsx"
import useAudioPlayer from '@/hooks/useAudioPlayer.ts'
import useSetting from '@/hooks/useSetting.ts'
import useVideoPreload from '@/hooks/useVideoPreload.ts'
useOnce("screenTip", screenTip, 500)
useAudioPlayer().buildRandomList()
// [Ethan] 启动时预加载所有视频主题，提前落缓存，避免切换时长时间等待
const videoSrcs = useSetting().themeList
  .filter((t) => t.type === 'video' && t.src)
  .map((t) => t.src!)
useVideoPreload().startPreload(videoSrcs)
</script>

<style scoped></style>
