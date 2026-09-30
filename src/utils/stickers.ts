// 新增文件：系统预设表情包 —— 仅站方提供的静态资源，无用户上传通道（流量考量）
// 资源位于 CDN images/stickers/，共 219 张：A 15 / B_H 174 / B_M 31(B_M_1 为 png)
import { getAssetUrl } from '@/utils/resource.ts'

export type StickerGroupKey = 'A' | 'B_H' | 'B_M'

const range = (prefix: string, from: number, to: number, ext = '.webp') =>
  Array.from({ length: to - from + 1 }, (_, i) => `${prefix}_${from + i}${ext}`)

export const STICKER_GROUPS: { key: StickerGroupKey; label: string; items: string[] }[] = [
  // 按内容分类：B_M=圆单人 / B_H=焰单人 / A=圆焰同框·带字日常（圆排最前）
  { key: 'B_M', label: '鹿目圆', items: ['B_M_1.png', ...range('B_M', 2, 31)] },
  { key: 'B_H', label: '晓美焰', items: range('B_H', 1, 174) },
  { key: 'A', label: '圆焰日常', items: range('A', 1, 15) },
]

// 文件名（不带扩展名）→ 带扩展名文件 的索引，用于把标记还原成资源
const STICKER_INDEX: Map<string, string> = new Map(
  STICKER_GROUPS.flatMap((g) => g.items.map((f) => [f.replace(/\.\w+$/, ''), f])),
)

/** 表情包资源地址（name 形如 "A_1"，不含扩展名） */
export const stickerUrl = (name: string) => {
  const file = STICKER_INDEX.get(name)
  return file ? getAssetUrl(`images/stickers/${file}`) : ''
}

/** 标记语法：[A_1] / [B_H_42] / [B_M_7] */
export const STICKER_MARKER_RE = /\[(A|B_H|B_M)_\d+\]/g

export type ContentPart = { type: 'text'; value: string } | { type: 'sticker'; value: string; url: string }

/** 把消息文本拆成 文本/表情 两类片段，供模板与 TSX 渲染 */
export const splitStickerText = (text: string): ContentPart[] => {
  const parts: ContentPart[] = []
  let last = 0
  for (const m of text.matchAll(STICKER_MARKER_RE)) {
    if (m.index! > last) parts.push({ type: 'text', value: text.slice(last, m.index) })
    const name = m[0].slice(1, -1)
    parts.push({ type: 'sticker', value: name, url: stickerUrl(name) })
    last = m.index! + m[0].length
  }
  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) })
  return parts
}
