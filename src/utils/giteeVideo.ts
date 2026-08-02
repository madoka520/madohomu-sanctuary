/**
 * [Ethan] GiteeVideo 工具模块
 * 从 GiteeVideoPlayer.vue 抽离的 Gitee 视频资源加载管线。
 *
 * 通过 Gitee API v5 拉取 M3U8 + TS 分片，base64 解码后生成 Blob URL。
 * 缓存策略（分片粒度）：
 *   L1 — 内存 Map（同会话秒播）
 *   L2 — IndexedDB 两个 store：m3u8 + segments（分片独立存取，关闭浏览器不丢）
 *   Promise.allSettled 保证部分成功的分片已落缓存，下次只补拉缺失的
 */

import { openDB } from 'idb'

// ══════════════════════════════════════════════════════════════
// [Ethan] 模块级 L1 缓存（单例，跨组件实例存活）
// ══════════════════════════════════════════════════════════════
const _m3u8Cache = new Map<string, string>()
const _segmentCache = new Map<string, Uint8Array>()

// ══════════════════════════════════════════════════════════════
// [Ethan] IndexedDB (L2) — idb 的 openDB 替代手写 indexedDB.open
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
      console.warn('[giteeVideo] IndexedDB 升级被旧连接阻塞，请关闭其他标签页')
    },
  })
}

const getDB = async () => {
  if (!_dbPromise) {
    _dbPromise = openGiteeDB().catch(async (err) => {
      // [Ethan] 版本冲突（如开发期版本号回退）→ 删除重建
      if (err instanceof DOMException && err.name === 'VersionError') {
        console.warn('[giteeVideo] IndexedDB 版本冲突，删除旧库重建')
        await new Promise<void>((resolve, reject) => {
          const req = indexedDB.deleteDatabase(IDB_NAME)
          req.onsuccess = () => resolve()
          req.onerror = () => reject(req.error)
          req.onblocked = () => console.warn('[giteeVideo] deleteDatabase 被阻塞')
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
// [Ethan] Gitee API 配置
// ══════════════════════════════════════════════════════════════

const GITEE = {
  owner: 'ultimate_madoka',
  repo: 'madohomu-sanctuary',
  branch: 'master',
  get apiBase() {
    return `https://gitee.com/api/v5/repos/${this.owner}/${this.repo}/contents`
  },
}

// ══════════════════════════════════════════════════════════════
// [Ethan] 重试逻辑
// ══════════════════════════════════════════════════════════════

/**
 * [Ethan] 带指数退避的重试包装器
 * - 网络错误 / 5xx / 429 → 退避重试（最多 maxRetries 次）
 * - 4xx（非 429）→ 立即抛出
 */
const withRetry = async <T>(
  fn: () => Promise<T>,
  label: string,
  maxRetries = 3,
): Promise<T> => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      if (attempt === maxRetries) throw err

      const msg = err instanceof Error ? err.message : ''
      // 4xx 客户端错误（排除 429 限流）不重试
      if (/Gitee API 4\d\d/.test(msg) && !msg.includes('429')) throw err

      const delay = Math.min(1000 * Math.pow(2, attempt), 8000)
      console.warn(
        `[giteeVideo] ${label} 失败，${delay / 1000}s 后重试 (${attempt + 1}/${maxRetries})`,
      )
      await new Promise((r) => setTimeout(r, delay))
    }
  }
  throw new Error('unreachable')
}

// ══════════════════════════════════════════════════════════════
// [Ethan] Gitee API 请求
// ══════════════════════════════════════════════════════════════

/** API v5 → JSON → base64 解码 → 文本 */
const fetchText = async (repoPath: string): Promise<string> => {
  return withRetry(async () => {
    const res = await fetch(`${GITEE.apiBase}/${repoPath}`)
    if (!res.ok) throw new Error(`Gitee API ${res.status}: ${repoPath}`)
    const json = await res.json()
    if (json.encoding !== 'base64' || !json.content) {
      throw new Error(`Unexpected response for ${repoPath}`)
    }
    return atob(json.content.replace(/\s/g, ''))
  }, `M3U8:${repoPath}`)
}

/** API v5 → JSON → base64 解码 → Uint8Array */
const fetchBytes = async (repoPath: string): Promise<Uint8Array> => {
  return withRetry(async () => {
    const res = await fetch(`${GITEE.apiBase}/${repoPath}`)
    if (!res.ok) throw new Error(`Gitee API ${res.status}: ${repoPath}`)
    const json = await res.json()
    if (json.encoding !== 'base64' || !json.content) {
      throw new Error(`Unexpected response for ${repoPath}`)
    }
    const raw = atob(json.content.replace(/\s/g, ''))
    const bytes = new Uint8Array(raw.length)
    for (let i = 0; i < raw.length; i++) {
      bytes[i] = raw.charCodeAt(i)
    }
    return bytes
  }, `TS:${repoPath}`)
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
// [Ethan] 分片加载（含 allSettled + 缓存逐片落盘）
// ══════════════════════════════════════════════════════════════

/**
 * [Ethan] 按分片粒度加载所有 TS 分片：
 *   对每个分片依次查 L1 → L2 → 标记需网络拉取
 *   用 allSettled 拉取缺失分片，成功的立即写 L1 + L2
 *   返回完整的分片 Map（全成功）或抛错（列出失败分片）
 */
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

    if (toFetch.length === 0) break // 全部命中缓存

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
        console.warn(`[giteeVideo] 分片 ${name} 拉取失败:`, r.reason)
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
// [Ethan] 公开 API
// ══════════════════════════════════════════════════════════════

/**
 * [Ethan] 加载 Gitee 视频资源
 *
 * 流程：
 *   1. M3U8 文本：L1 → L2 → API，缓存到 L1+L2
 *   2. 分片：逐片 L1 → L2 → API（allSettled，成功即落缓存）
 *   3. 构建 blob URL → 返回可播放的 M3U8 Blob URL
 *
 * @param src 视频路径，形如 /dev-cdn/videos/madoka-op-muted/playlist.m3u8
 * @returns m3u8BlobUrl 可直接赋给 <video>.src；revoke() 释放本次创建的全部 Blob URL
 */
export const loadGiteeVideo = async (
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

  // ── 构建 Blob URL ─────────────────────────────────────────
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
