<template>
  <div class="lyric-container" v-show="!(setting.theme === 1 && audioPlayer.currentSong.title === 'コネクト')">
    <div class="cyber-pink-lyric" :data-text="LyricState.currentLineText" :style="LyricState.lyricStyle">
      {{ LyricState.currentLineText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onUnmounted, watch } from 'vue'
import useAudioPlayer from '@/hooks/useAudioPlayer'
import { getAssetUrl } from '@/utils/resource'
import useSetting from '@/hooks/useSetting.ts'
const audioPlayer = useAudioPlayer()
const setting = useSetting()
const LyricState = (() => {
  interface Word {
    text: string
    start: number
    end: number
  }
  interface Line {
    start: number
    end: number
    words: Word[]
    text: string
  }

  const parseLrc = (text: string) => {
    const lines: Line[] = []
    const lineRegex = /^\[(\d+),(\d+)\](.+)$/gm
    let match: RegExpExecArray | null
    while ((match = lineRegex.exec(text))) {
      const lineStart = +match[1]
      const lineDuration = +match[2]
      const lineText = match[3]

      const words: Word[] = []
      const wordRegex = /([^\(\)]+)\((\d+),(\d+)\)/g
      let wMatch: RegExpExecArray | null
      while ((wMatch = wordRegex.exec(lineText))) {
        const wText = wMatch[1]
        const wStart = +wMatch[2]
        const wDuration = +wMatch[3]
        words.push({ text: wText, start: wStart, end: wStart + wDuration })
      }

      lines.push({
        start: lineStart,
        end: words.length ? words[words.length - 1].end : lineStart + lineDuration,
        words,
        text: words.map((w) => w.text).join(''),
      })
    }
    return lines
  }

  const s = reactive({
    lines: [] as Line[],
    currentLineIndex: -1,
    currentLine: null as Line | null,
    currentLineText: ' ',
    lyricStyle: { '--p': '0%' } as Record<string, string>,
  })

  let rafId: number | null = null
  let lastProgress = 0

  const loadLyrics = async (name?: string) => {
    s.currentLineIndex = -1
    s.currentLine = null
    lastProgress = 0
    s.lyricStyle['--p'] = '0%'

    if (!name) {
      s.currentLineText = '纯音乐，请欣赏'
      s.lines = []
      return
    }

    try {
      if (audioPlayer.currentSong.isInstrumental) {
        s.lines = []
        s.currentLineText = '纯音乐，请欣赏'
        return
      }
      const res = await fetch(getAssetUrl(`lrc/${name}.lrc`))
      if (!res.ok) throw new Error()
      const text = await res.text()
      const newLines = parseLrc(text)
      s.lines = newLines.length ? newLines : []
      if (!s.lines.length) s.currentLineText = '纯音乐，请欣赏'
    } catch {
      s.lines = []
      s.currentLineText = '纯音乐，请欣赏'
    }
  }

  const updateLyric = () => {
    const nowMs = audioPlayer.currentTime * 1000

    if (!s.lines.length) {
      s.currentLineText = '纯音乐，请欣赏'
      s.lyricStyle['--p'] = '0%'
      lastProgress = 0
    } else {
      let index = s.lines.findIndex((l) => nowMs >= l.start && nowMs <= l.end)
      if (index === -1) {
        if (nowMs < s.lines[0].start) index = 0
        else if (nowMs > s.lines[s.lines.length - 1].end) index = s.lines.length - 1
      }

      if (index !== -1 && index !== s.currentLineIndex) {
        s.currentLineIndex = index
        s.currentLine = s.lines[index]
        s.currentLineText = s.currentLine.text
        lastProgress = 0
      }

      const line = s.currentLine
      let targetProgress = 0

      if (line && line.words.length) {
        // 逐字渐变计算
        let progress = 0
        for (let i = 0; i < line.words.length; i++) {
          const w = line.words[i]
          if (nowMs >= w.end) {
            progress = (i + 1) / line.words.length
          } else if (nowMs >= w.start) {
            progress = (i + (nowMs - w.start) / (w.end - w.start)) / line.words.length
            break
          } else {
            break
          }
        }
        targetProgress = progress * 100
      }

      // 平滑过渡
      lastProgress += (targetProgress - lastProgress) * 0.2
      s.lyricStyle['--p'] = `${Math.min(Math.max(lastProgress, 0), 100)}%`
    }

    rafId = requestAnimationFrame(updateLyric)
  }

  watch(
    () => audioPlayer.currentSong?.title,
    async (title) => {
      if (!title) return
      if (rafId) cancelAnimationFrame(rafId)

      // 保留旧歌词显示
      s.currentLineIndex = -1
      s.currentLine = null
      s.currentLineText = s.lines[s.currentLineIndex]?.text ?? ' '
      lastProgress = 0
      s.lyricStyle['--p'] = '0%'

      await loadLyrics(title)
      rafId = requestAnimationFrame(updateLyric)
    },
  )

  onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId)
    s.lines = []
    s.currentLine = null
    s.currentLineIndex = -1
    s.currentLineText = ' '
    s.lyricStyle = { '--p': '0%' }
  })

  return s
})()
</script>

<style scoped lang="less">
// 调色盘：更纯净的少女粉与星光白
@madoka-pink: #ffb7ce;
@star-white: #ffffff;
@glow-soft: rgba(255, 183, 206, 0.6);
@text-dim: rgba(255, 183, 206, 0.15);

.lyric-container {
  padding: 40px;
  display: flex;
  justify-content: center;
  background: transparent;
  user-select: none;
}

.cyber-pink-lyric {
  position: relative;
  font-size: 38px;
  font-weight: 900;
  color: @text-dim;
  text-align: center;
  font-family: 'PingFang SC', sans-serif;

  // 1. 核心粉色填充层
  &::before {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    // --p 是从 JS 传进来的百分比变量 (例如: 45%)
    background: linear-gradient(to right, @madoka-pink var(--p), transparent var(--p));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    z-index: 2;
    // 外发光效果
    filter: drop-shadow(0 0 8px @glow-soft);
  }

  // 2. 繁星闪烁层
  &::after {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    z-index: 3;

    // 用径向渐变模拟细小的星点
    background-image:
      radial-gradient(circle at 20% 30%, @star-white 1px, transparent 1px), radial-gradient(circle at 50% 70%, @star-white 1.5px, transparent 1.5px),
      radial-gradient(circle at 80% 40%, @star-white 1px, transparent 1px), radial-gradient(circle at 30% 80%, @star-white 1.2px, transparent 1.2px),
      radial-gradient(circle at 70% 20%, @star-white 1px, transparent 1px);
    background-size: 100px 100%; // 星点分布周期

    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    // 闪烁动画
    animation: stars-twinkle 2s infinite ease-in-out;
  }

  // 3. 底层的粉色氛围光晕
  .lyric-glow {
    position: absolute;
    inset: 0;
    color: @madoka-pink;
    filter: blur(15px);
    opacity: 0.4;
    z-index: 1;
    // 同样跟随进度
    mask-image: linear-gradient(to right, black var(--p), transparent var(--p));
    -webkit-mask-image: linear-gradient(to right, black var(--p), transparent var(--p));
  }
}

// 星星闪烁动画：改变透明度和微小位移
@keyframes stars-twinkle {
  0%,
  100% {
    opacity: 0.4;
    filter: brightness(1);
  }
  50% {
    opacity: 1;
    filter: brightness(1.5) drop-shadow(0 0 2px @star-white);
  }
}
</style>
