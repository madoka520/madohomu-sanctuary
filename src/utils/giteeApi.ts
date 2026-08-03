/**
 * [Ethan] Gitee API 工具
 * 传入 Gitee 仓库文件路径，返回解码后的文件内容。
 *   fetchText(path)  → 文本（用于 .m3u8）
 *   fetchBytes(path) → 二进制（用于 .ts 分片）
 */

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
export const fetchText = async (repoPath: string): Promise<string> => {
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
export const fetchBytes = async (repoPath: string): Promise<Uint8Array> => {
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
