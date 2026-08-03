import { defineStore } from 'pinia'
import { preloadGiteeVideo } from '@/utils/videoCache.ts'

export enum CacheStatus {
  Loading = 'loading',
  Cached = 'cached',
  Error = 'error',
}

export default defineStore('videoPreload', () => {
  const s = reactive({
    /** 视频缓存状态：按 src → CacheStatus */
    cacheStatus: {} as Record<string, CacheStatus>,

    /** 已缓存视频数 */
    cachedCount: computed(() =>
      Object.values(s.cacheStatus).filter((v) => v === CacheStatus.Cached).length,
    ),

    /** 视频主题总数 */
    totalCount: 0,

    /** 启动预加载，每次调用重置计数 */
    startPreload: (videoSrcs: string[]) => {
      s.totalCount = videoSrcs.length
      for (const src of videoSrcs) {
        s.cacheStatus[src] = CacheStatus.Loading
        preloadGiteeVideo(src)
          .then(() => {
            s.cacheStatus[src] = CacheStatus.Cached
          })
          .catch(() => {
            s.cacheStatus[src] = CacheStatus.Error
          })
      }
    },

    /** 重试单个视频预加载 */
    retryPreload: async (src: string) => {
      s.cacheStatus[src] = CacheStatus.Loading
      try {
        await preloadGiteeVideo(src)
        s.cacheStatus[src] = CacheStatus.Cached
      } catch {
        s.cacheStatus[src] = CacheStatus.Error
      }
    },
  })

  return toRefs(s)
})
