<template>
  <!-- [原代码] 单层 <video>，无加载/错误状态 UI -->
  <!--
  <video
    ref="videoRef"
    style="width: 100%; height: 100%"
    class="gitee-video-player"
    autoplay
    muted
    loop
    playsinline
  />
  -->
  <video
    ref="videoRef"
    style="width: 100%; height: 100%"
    class="gitee-video-player"
    autoplay
    muted
    loop
    playsinline
  />
</template>

<!--
  [Ethan] 模块级 L1+L2 缓存已迁移至 src/utils/giteeVideo.ts（单例，跨组件实例存活）
-->

<script setup lang="ts">
/**
 * [Ethan] GiteeVideoPlayer
 * 薄封装：管理 <video> 元素与生命周期。核心数据管线（API → 缓存 → Blob URL）委托给
 * src/utils/giteeVideo.ts 的 loadGiteeVideo()。
 *
 * 用法：<gitee-video-player src="/dev-cdn/videos/madoka-op-muted/playlist.m3u8" />
 */

import { loadGiteeVideo } from '@/utils/videoCache.ts'

const props = withDefaults(
  defineProps<{
    src?: string
  }>(),
  {},
)

const emit = defineEmits<{
  (e: 'loading'): void
  (e: 'loaded'): void
  (e: 'error'): void
}>()

const videoRef = useTemplateRef<HTMLVideoElement>('videoRef')

// ══════════════════════════════════════════════════════════════
// [Ethan] 新版 Player 模块：reactive + IIFE（薄封装）
// ══════════════════════════════════════════════════════════════
const Player = (() => {
  let _handle: { revoke: () => void } | null = null

  /*
  [原代码]
  const f = {
    load: async () => {
      const video = videoRef.value
      if (!video || !props.src) return
      f.destroy()
      const src = props.src
      try {
        const handle = await loadGiteeVideo(src)
        if (props.src !== src) { handle.revoke(); return }
        _handle = handle
        video.src = handle.m3u8BlobUrl
      } catch (err) {
        console.error('[GiteeVideoPlayer] 加载失败:', err)
      }
    },
    destroy: () => { _handle?.revoke(); _handle = null },
  }
  */
  // [Ethan] 增加 emit 事件通知父组件加载状态
  const f = {
    /** 加载视频：委托 loadGiteeVideo，结果赋给 video.src */
    load: async () => {
      const video = videoRef.value
      if (!video || !props.src) return

      f.destroy()
      emit('loading')

      // [Ethan] 捕获当前 src，防止异步加载期间 props 变更导致过期结果覆盖
      const src = props.src
      try {
        const handle = await loadGiteeVideo(src)
        if (props.src !== src) {
          handle.revoke()
          return
        }
        _handle = handle
        video.src = handle.m3u8BlobUrl
        emit('loaded')
      } catch (err) {
        console.error('[GiteeVideoPlayer] 加载失败:', err)
        emit('error')
      }
    },

    /** 释放本次 Blob URL（缓存保留） */
    destroy: () => {
      _handle?.revoke()
      _handle = null
    },
  }

  const init = () => {}
  const s = reactive({
    ...f,
    // [Ethan] 本地 loading / error 状态（模板内使用）
    loading: false,
    error: false,
  })
  init()
  // [Ethan] onMounted 处理首次加载（此时 videoRef 可用）
  onMounted(() => {
    if (props.src) f.load()
  })
  // [Ethan] watch 处理 src 变化（切换主题），不用 immediate（videoRef 在 setup 阶段为 null）
  watch(() => props.src, () => f.load())
  onUnmounted(() => f.destroy())

  return s
})()
</script>

<style scoped>
.gitee-video-player {
  width: 100%;
  height: 100%;
  /* [Ethan] 视频拉伸填满容器，不保持比例 */
  object-fit: fill;
}
</style>
