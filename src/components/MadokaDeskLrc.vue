<template>
  <div class="lyric-container">
    <div class="cyber-pink-lyric" :data-text="LyricState.currentLineText" :style="LyricState.lyricStyle">
      {{ LyricState.currentLineText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onUnmounted, watch } from "vue"
import useAudioPlayer from "@/hooks/useAudioPlayer"
import { getAssetUrl } from "@/utils/resource"

const LyricState = (() => {
  const audioPlayer = useAudioPlayer()

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
        text: words.map((w) => w.text).join(""),
      })
    }
    return lines
  }

  const s = reactive({
    lines: [] as Line[],
    currentLineIndex: -1,
    currentLine: null as Line | null,
    currentLineText: " ",
    lyricStyle: { "--p": "0%" } as Record<string, string>,
  })

  let rafId: number | null = null
  let lastProgress = 0

  const loadLyrics = async (name?: string) => {
    s.currentLineIndex = -1
    s.currentLine = null
    lastProgress = 0
    s.lyricStyle["--p"] = "0%"

    if (!name) {
      s.currentLineText = "纯音乐，请欣赏"
      s.lines = []
      return
    }

    try {
      const res = await fetch(getAssetUrl(`lrc/${name}.lrc`))
      if (!res.ok) throw new Error()
      const text = await res.text()
      const newLines = parseLrc(text)
      s.lines = newLines.length ? newLines : []
      if (!s.lines.length) s.currentLineText = "纯音乐，请欣赏"
    } catch {
      s.lines = []
      s.currentLineText = "纯音乐，请欣赏"
    }
  }

  const updateLyric = () => {
    const nowMs = audioPlayer.currentTime * 1000

    if (!s.lines.length) {
      s.currentLineText = "纯音乐，请欣赏"
      s.lyricStyle["--p"] = "0%"
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
      s.lyricStyle["--p"] = `${Math.min(Math.max(lastProgress, 0), 100)}%`
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
      s.currentLineText = s.lines[s.currentLineIndex]?.text ?? " "
      lastProgress = 0
      s.lyricStyle["--p"] = "0%"

      await loadLyrics(title)
      rafId = requestAnimationFrame(updateLyric)
    },
    { immediate: true },
  )

  onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId)
    s.lines = []
    s.currentLine = null
    s.currentLineIndex = -1
    s.currentLineText = " "
    s.lyricStyle = { "--p": "0%" }
  })

  return s
})()
</script>

<style scoped lang="less">
@active-pink: #ff85a2;

.lyric-container {
  padding: 40px;
  display: flex;
  justify-content: center;
}

.cyber-pink-lyric {
  position: relative;
  font-size: 32px;
  font-weight: 800;
  text-align: center;
  color: rgba(255, 133, 162, 0.25);

  &::before {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, @active-pink var(--p), transparent var(--p));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: none;
  }

  &::after {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    color: @active-pink;
    filter: blur(8px);
    opacity: 0.6;
    z-index: -1;
    pointer-events: none;
  }
}
</style>
