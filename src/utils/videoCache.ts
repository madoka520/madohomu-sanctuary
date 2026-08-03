/**
 * [Ethan] VideoCache 模块
 * Gitee 视频资源加载管线：L1 内存缓存 → L2 IndexedDB → Gitee API → Blob URL。
 *
 * 缓存策略（分片粒度）：
 *   L1 — 内存 Map（同会话秒播，跨组件实例存活）
 *   L2 — IndexedDB 两个 store：m3u8 + segments（分片独立存取，关闭浏览器不丢）
 *   Promise.allSettled 保证部分成功的分片已落缓存，下次只补拉缺失的
 */
import { openDB } from 'idb'
import { fetchText, fetchBytes } from '@/utils/giteeApi.ts'

// ══════════════════════════════════════════════════════════════
// [Ethan] 模块级 L1 缓存（单例，跨组件实例存活）
// ══════════════════════════════════════════════════════════════
const _m3u8Cache = new Map<string, string>()
const _segmentCache = new Map<string, Uint8Array>()

// ══════════════════════════════════════════════════════════════
// [Ethan] IndexedDB (L2)
// ══════════════════════════════════════════════════════════════
const IDB_NAME = 'gitee-video-cache'
const IDB_VERSION = 3

let _dbPromise: ReturnType<typeof openDB> | null = null

const openGiteeDB = () => {
  return openDB(IDB_NAME, IDB_VERSION, {
    upgrade(db) {
      // [Ethan] 删除旧版残留 store（v1 的 videos），避免跨版本冲突
      for (const name of db.objectStoreNames) {
        if (name !== 'm3u8' && name !== 'segments') {
          db.deleteObjectStore(name)
        }
      }
      if (!db.objectStoreNames.contains('m3u8')) {
        db.createObjectStore('m3u8', { keyPath: 'src' })
      }
      if (!db.objectStoreNames.contains('segments')) {
        db.createObjectStore('segments', { keyPath: 'path' })
      }
    },
    blocked() {
      console.warn('[videoCache] IndexedDB 升级被旧连接阻塞，请关闭其他标签页')
    },
  })
}

const getDB = async () => {
  if (!_dbPromise) {
    _dbPromise = openGiteeDB().catch(async (err) => {
      // [Ethan] 版本冲突（如开发期版本号回退）→ 删除重建
      if (err instanceof DOMException && err.name === 'VersionError') {
        console.warn('[videoCache] IndexedDB 版本冲突，删除旧库重建')
        await new Promise<void>((resolve, reject) => {
          const req = indexedDB.deleteDatabase(IDB_NAME)
          req.onsuccess = () => resolve()
          req.onerror = () => reject(req.error)
          req.onblocked = () => console.warn('[videoCache] deleteDatabase 被阻塞')
        })
        return openGiteeDB()
      }
      // [Ethan] 其他错误 → 清空单例，下次调用重试
      _dbPromise = null
      throw err
    })
  }
  return _dbPromise
}

// ══════════════════════════════════════════════════════════════
// [Ethan] L2 读写辅助
// ══════════════════════════════════════════════════════════════

const l2GetM3u8 = async (src: string): Promise<string | undefined> => {
  const db = await getDB()
  const row = await db.get('m3u8', src) as { text: string } | undefined
  return row?.text
}

const l2PutM3u8 = async (src: string, text: string): Promise<void> => {
  const db = await getDB()
  await db.put('m3u8', { src, text })
}

const l2GetSegment = async (repoPath: string): Promise<Uint8Array | undefined> => {
  const db = await getDB()
  const row = await db.get('segments', repoPath) as { data: ArrayBuffer } | undefined
  return row ? new Uint8Array(row.data) : undefined
}

const l2PutSegment = async (repoPath: string, bytes: Uint8Array): Promise<void> => {
  const db = await getDB()
  // [Ethan] Uint8Array → 精确 ArrayBuffer（.buffer 可能更大）
  const data = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
  await db.put('segments', { path: repoPath, data })
}

// ══════════════════════════════════════════════════════════════
// [Ethan] M3U8 处理
// ══════════════════════════════════════════════════════════════

/** 提取所有 .ts 分片文件名 */
const parseSegmentNames = (m3u8: string): string[] => {
  return m3u8
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && l.endsWith('.ts'))
}

/** M3U8 中的 .ts 路径 → blob URL */
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

/** 从分片 Map 生成 blob URL 映射表 */
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

      // ③ 需要网络拉取
      toFetch.push({ name, path: segPath })
    }

    if (toFetch.length === 0) {
      pending = []
      break
    }

    // 并行拉取，allSettled 不因单个失败而丢弃其他成功结果
    const results = await Promise.allSettled(
      toFetch.map((f) => fetchBytes(f.path)),
    )

    pending = []
    for (let i = 0; i < toFetch.length; i++) {
      const { name, path } = toFetch[i]
      const r = results[i]
      if (r.status === 'fulfilled') {
        // 成功 → 立即写入 L1 + L2（L2 写入失败不影响流程）
        const bytes = r.value
        segments.set(name, bytes)
        _segmentCache.set(path, bytes)
        l2PutSegment(path, bytes).catch(() => {})
      } else {
        // 失败 → 下一轮重试
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
    if (m3u8Text) {
      _m3u8Cache.set(cacheKey, m3u8Text)
    }
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

/**
 * [Ethan] 加载 Gitee 视频资源
 *
 * 流程：M3U8 文本 L1→L2→API → 分片逐片 L1→L2→API → Blob URL → 可播放的 M3U8 Blob URL
 * 并发去重：同一 src 的多次调用共享同一个 Promise
 */
export const loadGiteeVideo = async (
  src: string,
): Promise<{ m3u8BlobUrl: string; revoke: () => void }> => {
  // [Ethan] 如果有正在进行的预加载，等待其完成（此时 L1 已就绪）
  const preload = _pendingPreloads.get(src)
  if (preload) {
    await preload.catch(() => {})
  }

  const pending = _pendingLoads.get(src)
  if (pending) return pending

  const promise = _doLoad(src).finally(() => {
    _pendingLoads.delete(src)
  })
  _pendingLoads.set(src, promise)
  return promise
}

/**
 * [Ethan] 预加载视频资源（仅填充 L1+L2 缓存，不返回 Blob URL）
 *
 * 应用启动时调用，提前拉取 M3U8 + 全部分片落盘。
 * 后续 loadGiteeVideo 命中缓存即可即时播放。
 */
export const preloadGiteeVideo = async (src: string): Promise<void> => {
  // [Ethan] 去重：正在预加载中直接复用 Promise
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
