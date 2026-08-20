/**
 * [Ethan] AudioCache 模块
 * Gitee 音频资源加载管线：L1 内存缓存 → L2 IndexedDB → Gitee API → Blob URL。
 *
 * 缓存策略（单文件，比分片视频简单得多）：
 *   L1 — 内存 Map<src, Uint8Array>（同会话秒播，跨组件实例存活）
 *   L2 — IndexedDB store 'audio'（{ src, data: ArrayBuffer }，持久化，关浏览器不丢）
 *   Blob URL 按需创建，调用方负责 revoke
 */
import { dbGet, dbPut } from '@/utils/indexedDB.ts'
import { fetchBytes } from '@/utils/giteeApi.ts'

// ══════════════════════════════════════════════════════════════
// [Ethan] L2 读写适配（audio store: { src, data }）
// ══════════════════════════════════════════════════════════════

const l2GetAudio = async (src: string): Promise<Uint8Array | undefined> => {
  const row = await dbGet<{ data: ArrayBuffer }>('audio', src)
  return row ? new Uint8Array(row.data) : undefined
}

const l2PutAudio = (src: string, bytes: Uint8Array) => {
  const data = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
  return dbPut('audio', { src, data } as Record<string, unknown>)
}

// ══════════════════════════════════════════════════════════════
// [Ethan] 模块级 L1 缓存（单例，跨组件实例存活）
// ══════════════════════════════════════════════════════════════

const _audioCache = new Map<string, Uint8Array>()

// ══════════════════════════════════════════════════════════════
// [Ethan] 去重：并发请求同一文件时复用同一个 Promise
// ══════════════════════════════════════════════════════════════

const _pendingLoads = new Map<string, Promise<Uint8Array>>()
const _pendingPreloads = new Map<string, Promise<void>>()

// ══════════════════════════════════════════════════════════════
// [Ethan] 核心加载（L1 → L2 → Gitee API）
// ══════════════════════════════════════════════════════════════

const _doLoad = async (src: string): Promise<Uint8Array> => {
  // ① L1 内存缓存
  const l1 = _audioCache.get(src)
  if (l1) return l1

  // ② L2 IndexedDB
  try {
    const l2 = await l2GetAudio(src)
    if (l2) {
      _audioCache.set(src, l2)
      return l2
    }
  } catch {
    // IndexedDB 读取失败不阻塞，走网络
  }

  // ③ Gitee API
  const repoPath = `public${src}`
  const bytes = await fetchBytes(repoPath)
  _audioCache.set(src, bytes)
  // [Ethan] 异步写 L2，不阻塞返回
  l2PutAudio(src, bytes).catch(() => {})

  return bytes
}

// ══════════════════════════════════════════════════════════════
// [Ethan] 公开 API
// ══════════════════════════════════════════════════════════════

/**
 * 加载音频文件，返回 Blob URL 和 revoke 方法。
 * 复用 _pendingPreloads 的结果，去重 _pendingLoads。
 *
 * @param src — CDN 路径，形如 /dev-cdn/music/Decretum.weba
 */
export const loadGiteeAudio = async (
  src: string,
): Promise<{ blobUrl: string; revoke: () => void }> => {
  // 等待进行中的预加载完成（其数据已写入 L1）
  const preload = _pendingPreloads.get(src)
  if (preload) await preload.catch(() => {})

  // 预加载完成后 L1 可能已有数据
  const l1 = _audioCache.get(src)
  if (l1) {
    const blob = new Blob([l1], { type: 'video/webm' })
    const blobUrl = URL.createObjectURL(blob)
    return { blobUrl, revoke: () => URL.revokeObjectURL(blobUrl) }
  }

  // 去重：已有进行中的加载则复用
  const pending = _pendingLoads.get(src)
  if (pending) {
    const bytes = await pending
    const blob = new Blob([bytes], { type: 'video/webm' })
    const blobUrl = URL.createObjectURL(blob)
    return { blobUrl, revoke: () => URL.revokeObjectURL(blobUrl) }
  }

  const promise = _doLoad(src).finally(() => _pendingLoads.delete(src))
  _pendingLoads.set(src, promise)

  const bytes = await promise
  const blob = new Blob([bytes], { type: 'video/webm' })
  const blobUrl = URL.createObjectURL(blob)
  return { blobUrl, revoke: () => URL.revokeObjectURL(blobUrl) }
}

/**
 * [Ethan] 预加载音频文件到 L1 + L2，不返回 Blob URL。
 * 用于后台预加载下一首，切歌时秒播。
 *
 * @param src — CDN 路径，形如 /dev-cdn/music/Decretum.weba
 */
export const preloadGiteeAudio = async (src: string): Promise<void> => {
  if (_audioCache.has(src)) return

  const pending = _pendingPreloads.get(src)
  if (pending) return pending

  const promise = _doLoad(src).then(() => {})
  _pendingPreloads.set(src, promise)
  promise.finally(() => _pendingPreloads.delete(src))
  return promise
}
