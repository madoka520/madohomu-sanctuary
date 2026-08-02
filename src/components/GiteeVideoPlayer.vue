<template>
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

import { loadGiteeVideo } from '@/utils/giteeVideo.ts'

const props = withDefaults(
  defineProps<{
    src?: string
  }>(),
  {},
)

const videoRef = useTemplateRef<HTMLVideoElement>('videoRef')

/*
 * ═══════════════════════════════════════════════════════════════════════════
 * [原代码] 以下为原始实现，已整体迁移至 src/utils/giteeVideo.ts。
 *   包含：idb 导入、GITEE 配置、getDB/IndexedDB 读写、withRetry 重试、
 *   fetchText/fetchBytes（API v5 base64 解码）、parseSegmentNames/rewriteWithBlobs
 *   /buildBlobMap（M3U8 处理）、loadSegments（分片加载 + allSettled 重试）、
 *   Player.load / Player.destroy。
 *   保留此注释块以供对照。原始代码见 git 历史或上述 utility 文件。
 * ═══════════════════════════════════════════════════════════════════════════
 *
const Player = (() => {
  let _blobUrls: string[] = []

  const GITEE = {
    owner: 'ultimate_madoka',
    repo: 'madohomu-sanctuary',
    branch: 'master',
    get apiBase() {
      return `https://gitee.com/api/v5/repos/${this.owner}/${this.repo}/contents`
    },
  }

  const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
  }

  const IDB_NAME = 'gitee-video-cache'
  const IDB_VERSION = 2

  const getDB = () => {
    if (!_dbPromise) {
      _dbPromise = openDB(IDB_NAME, IDB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('m3u8')) db.createObjectStore('m3u8', { keyPath: 'src' })
          if (!db.objectStoreNames.contains('segments')) db.createObjectStore('segments', { keyPath: 'path' })
        },
      })
    }
    return _dbPromise
  }

  const l2GetM3u8 = async (src: string): Promise<string | undefined> => { ... }
  const l2PutM3u8 = async (src: string, text: string): Promise<void> => { ... }
  const l2GetSegment = async (repoPath: string): Promise<Uint8Array | undefined> => { ... }
  const l2PutSegment = async (repoPath: string, bytes: Uint8Array): Promise<void> => { ... }

  const withRetry = async <T>(fn: () => Promise<T>, label: string, maxRetries = 3): Promise<T> => { ... }
  const fetchText = async (repoPath: string): Promise<string> => { ... }
  const fetchBytes = async (repoPath: string): Promise<Uint8Array> => { ... }

  const parseSegmentNames = (m3u8: string): string[] => { ... }
  const rewriteWithBlobs = (m3u8: string, blobMap: Record<string, string>): string => { ... }
  const buildBlobMap = (segments: Map<string, Uint8Array>): Record<string, string> => { ... }

  const loadSegments = async (segmentNames: string[], segmentDir: string, maxRounds = 3): Promise<Map<string, Uint8Array>> => { ... }

  const f = {
    load: async () => {
      const video = videoRef.value
      if (!video || !props.src) return
      f.destroy()
      try {
        const m3u8RepoPath = `public${props.src}`
        const segmentDir = m3u8RepoPath.replace(/\/[^/]+$/, '')
        const cacheKey = props.src

        let m3u8Text = _m3u8Cache.get(cacheKey)
        if (!m3u8Text) {
          m3u8Text = await l2GetM3u8(cacheKey)
          if (m3u8Text) _m3u8Cache.set(cacheKey, m3u8Text)
        }
        if (!m3u8Text) {
          m3u8Text = await fetchText(m3u8RepoPath)
          _m3u8Cache.set(cacheKey, m3u8Text)
          l2PutM3u8(cacheKey, m3u8Text).catch(() => {})
        }

        const segmentNames = parseSegmentNames(m3u8Text)
        const segments = await loadSegments(segmentNames, segmentDir)

        const blobMap = buildBlobMap(segments)
        const rewritten = rewriteWithBlobs(m3u8Text, blobMap)
        const m3u8Blob = new Blob([rewritten], { type: 'application/vnd.apple.mpegurl' })
        const m3u8BlobUrl = URL.createObjectURL(m3u8Blob)
        _blobUrls.push(m3u8BlobUrl)
        video.src = m3u8BlobUrl
      } catch (err) {
        console.error('[GiteeVideoPlayer] 加载失败:', err)
      }
    },
    destroy: () => {
      for (const url of _blobUrls) URL.revokeObjectURL(url)
      _blobUrls = []
    },
  }

  const init = () => {}
  const initOnMounted = () => { if (props.src) f.load() }
  const s = reactive({ ...f })
  init()
  onMounted(initOnMounted)
  onUnmounted(() => f.destroy())
  return s
})()
 */

// ══════════════════════════════════════════════════════════════
// [Ethan] 新版 Player 模块：reactive + IIFE（薄封装）
// ══════════════════════════════════════════════════════════════
const Player = (() => {
  let _handle: { revoke: () => void } | null = null

  const f = {
    /** 加载视频：委托 loadGiteeVideo，结果赋给 video.src */
    load: async () => {
      const video = videoRef.value
      if (!video || !props.src) return

      f.destroy()

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
      } catch (err) {
        console.error('[GiteeVideoPlayer] 加载失败:', err)
      }
    },

    /** 释放本次 Blob URL（缓存保留） */
    destroy: () => {
      _handle?.revoke()
      _handle = null
    },
  }

  const init = () => {}
  const s = reactive({ ...f })
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
