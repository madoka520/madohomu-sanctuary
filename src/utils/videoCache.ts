/**
 * [Ethan] VideoCache 模块
 * Gitee 视频资源加载管线：L1 内存缓存 → L2 IndexedDB → Gitee API → Blob URL。
 *
 * 缓存策略（分片粒度）：
 *   L1 — 内存 Map（同会话秒播，跨组件实例存活）
 *   L2 — IndexedDB（见 src/utils/videoDB.ts）
 *   Promise.allSettled 保证部分成功的分片已落缓存，下次只补拉缺失的
 */
import { dbGet, dbPut } from '@/utils/indexedDB.ts'
import { fetchText, fetchBytes } from '@/utils/giteeApi.ts'

// [Ethan] L2 读写适配（m3u8 store: { src, text } / segments store: { path, data }）
const l2GetM3u8 = async (src: string) =>
  (await dbGet<{ text: string }>('m3u8', src))?.text
const l2PutM3u8 = (src: string, text: string) =>
  dbPut('m3u8', { src, text } as Record<string, unknown>)
const l2GetSegment = async (path: string) => {
  const row = await dbGet<{ data: ArrayBuffer }>('segments', path)
  return row ? new Uint8Array(row.data) : undefined
}
const l2PutSegment = (path: string, bytes: Uint8Array) => {
  const data = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
  return dbPut('segments', { path, data } as Record<string, unknown>)
}

// ══════════════════════════════════════════════════════════════
// [Ethan] 模块级 L1 缓存（单例，跨组件实例存活）
// ══════════════════════════════════════════════════════════════
const _m3u8Cache = new Map<string, string>()
const _segmentCache = new Map<string, Uint8Array>()

// ══════════════════════════════════════════════════════════════
// [Ethan] M3U8 处理
// ══════════════════════════════════════════════════════════════

const parseSegmentNames = (m3u8: string): string[] => {
  return m3u8
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && l.endsWith('.ts'))
}

const rewriteWithBlobs = (m3u8: string, blobMap: Record<string, string>): string => {
  const lines = m3u8.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim()
    if (trimmed && !trimmed.startsWith('#') && trimmed.endsWith('.ts')) {
      lines[i] = blobMap[trimmed] ?? lines[i]
    }
  }
  return lines.join('\n')
}

const buildBlobMap = (
  segments: Map<string, Uint8Array>,
  blobUrls: string[],
): Record<string, string> => {
  const map: Record<string, string> = {}
  for (const [name, bytes] of segments) {
    const blob = new Blob([bytes], { type: 'video/mp2t' })
    const url = URL.createObjectURL(blob)
    blobUrls.push(url)
    map[name] = url
  }
  return map
}

// ══════════════════════════════════════════════════════════════
// [Ethan] 分片加载（L1 → L2 → Gitee API，allSettled + 缓存逐片落盘）
// ══════════════════════════════════════════════════════════════

const loadSegments = async (
  segmentNames: string[],
  segmentDir: string,
  maxRounds = 3,
): Promise<Map<string, Uint8Array>> => {
  const segments = new Map<string, Uint8Array>()
  let pending = [...segmentNames]

  for (let round = 0; round < maxRounds && pending.length > 0; round++) {
    const toFetch: { name: string; path: string }[] = []

    for (const name of pending) {
      const segPath = `${segmentDir}/${name}`

      // ① L1
      const l1 = _segmentCache.get(segPath)
      if (l1) {
        segments.set(name, l1)
        continue
      }

      // ② L2
      const l2 = await l2GetSegment(segPath).catch(() => undefined)
      if (l2) {
        _segmentCache.set(segPath, l2)
        segments.set(name, l2)
        continue
      }

      // ③ Gitee API
      toFetch.push({ name, path: segPath })
    }

    if (toFetch.length === 0) {
      pending = []
      break
    }

    const results = await Promise.allSettled(
      toFetch.map((f) => fetchBytes(f.path)),
    )

    pending = []
    for (let i = 0; i < toFetch.length; i++) {
      const { name, path } = toFetch[i]
      const r = results[i]
      if (r.status === 'fulfilled') {
        const bytes = r.value
        segments.set(name, bytes)
        _segmentCache.set(path, bytes)
        l2PutSegment(path, bytes).catch(() => {})
      } else {
        console.warn(`[videoCache] 分片 ${name} 拉取失败:`, r.reason)
        pending.push(name)
      }
    }
  }

  if (pending.length > 0) {
    throw new Error(`分片加载失败 (${pending.length} 个): ${pending.join(', ')}`)
  }
  return segments
}

// ══════════════════════════════════════════════════════════════
// [Ethan] 主加载管线
// ══════════════════════════════════════════════════════════════

const _pendingLoads = new Map<string, Promise<{ m3u8BlobUrl: string; revoke: () => void }>>()
const _pendingPreloads = new Map<string, Promise<void>>()

const _doLoad = async (
  src: string,
): Promise<{ m3u8BlobUrl: string; revoke: () => void }> => {
  const blobUrls: string[] = []

  const m3u8RepoPath = `public${src}`
  const segmentDir = m3u8RepoPath.replace(/\/[^/]+$/, '')
  const cacheKey = src

  // ── M3U8 ──────────────────────────────────────────────────
  let m3u8Text = _m3u8Cache.get(cacheKey)
  if (!m3u8Text) {
    m3u8Text = await l2GetM3u8(cacheKey).catch(() => undefined)
    if (m3u8Text) _m3u8Cache.set(cacheKey, m3u8Text)
  }
  if (!m3u8Text) {
    m3u8Text = await fetchText(m3u8RepoPath)
    _m3u8Cache.set(cacheKey, m3u8Text)
    l2PutM3u8(cacheKey, m3u8Text).catch(() => {})
  }

  // ── 分片 ──────────────────────────────────────────────────
  const segmentNames = parseSegmentNames(m3u8Text)
  const segments = await loadSegments(segmentNames, segmentDir)
  const blobMap = buildBlobMap(segments, blobUrls)
  const rewritten = rewriteWithBlobs(m3u8Text, blobMap)
  const m3u8Blob = new Blob([rewritten], { type: 'application/vnd.apple.mpegurl' })
  const m3u8BlobUrl = URL.createObjectURL(m3u8Blob)
  blobUrls.push(m3u8BlobUrl)

  const revoke = () => {
    for (const url of blobUrls) {
      URL.revokeObjectURL(url)
    }
    blobUrls.length = 0
  }

  return { m3u8BlobUrl, revoke }
}

// ══════════════════════════════════════════════════════════════
// [Ethan] 公开 API
// ══════════════════════════════════════════════════════════════

export const loadGiteeVideo = async (
  src: string,
): Promise<{ m3u8BlobUrl: string; revoke: () => void }> => {
  const preload = _pendingPreloads.get(src)
  if (preload) await preload.catch(() => {})

  const pending = _pendingLoads.get(src)
  if (pending) return pending

  const promise = _doLoad(src).finally(() => _pendingLoads.delete(src))
  _pendingLoads.set(src, promise)
  return promise
}

export const preloadGiteeVideo = async (src: string): Promise<void> => {
  const pending = _pendingPreloads.get(src)
  if (pending) return pending

  const promise = (async () => {
    const result = await _doLoad(src)
    result.revoke()
  })()
  _pendingPreloads.set(src, promise)
  promise.finally(() => _pendingPreloads.delete(src))
  return promise
}
