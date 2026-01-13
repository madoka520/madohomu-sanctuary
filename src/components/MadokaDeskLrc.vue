<template>
  <div class="lyric-container">
    <div
      class="cyber-pink-lyric"
      :data-text="Root.currentLine"
      :style="lyricStyle"
    >
      {{ Root.currentLine }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch, onUnmounted } from "vue"
import Lyric from "lyric-parser"
import useAudioPlayer from "@/hooks/useAudioPlayer"
import { getAssetUrl } from "@/utils/resource"

interface LyricLine {
  time: number // 秒
  text: string
}

const audioPlayer = useAudioPlayer()

const Root = (() => {
  const s = reactive({
    lyricInst: null as Lyric | null,

    currentLine: " ",
    currentLineNum: -1,

    lineStart: 0,   // ms
    lineEnd: 0      // ms
  })

  const reset = () => {
    s.currentLine = "暂无歌词"
    s.currentLineNum = -1
    s.lineStart = 0
    s.lineEnd = 0
    s.lyricInst?.stop()
    s.lyricInst = null
  }

  /**
   * ⚠️ 唯一的歌词驱动入口
   * 所有状态都从 lyricInst 来
   */
  const handleLyric = ({ lineNum, txt }: { lineNum: number; txt: string }) => {
    if (!s.lyricInst) return

    s.currentLineNum = lineNum
    s.currentLine = txt || " "

    const lines = s.lyricInst.lines
    s.lineStart = lines[lineNum].time
    s.lineEnd =
      lineNum < lines.length - 1
        ? lines[lineNum + 1].time
        : lines[lineNum].time + 3000 // 最后一行兜底
  }

  const buildLrc = (list: LyricLine[]) =>
    list
      .map(({ time, text }) => {
        const m = Math.floor(time / 60).toString().padStart(2, "0")
        const s = (time % 60).toFixed(3).padStart(6, "0")
        return `[${m}:${s}]${text}`
      })
      .join("\n")

  const loadLyrics = async (name?: string) => {
    reset()
    if (!name) return

    try {
      const res = await fetch(getAssetUrl(`lrc/${name}.json`))
      if (!res.ok) throw new Error()

      const json = (await res.json()) as LyricLine[]
      const lrc = buildLrc(json)

      s.lyricInst = new Lyric(lrc, handleLyric)

      // 用 seek 驱动（不 play）
      // s.lyricInst.seek(audioPlayer.currentTime * 1000)
    } catch {
      reset()
    }
  }

  /**
   * ⬇️ 唯一的时间同步方式
   * 不 play / 不 stop
   */
  watch(
    () => audioPlayer.currentTime,
    (t) => s.lyricInst?.seek(t * 1000)
  )

  watch(
    () => audioPlayer.currentSong?.title,
    (name) => loadLyrics(name),
    { immediate: true }
  )

  onUnmounted(() => {
    s.lyricInst?.stop()
  })

  return s
})()

/**
 * 进度 = 当前时间在 lyricInst 给的行区间中的占比
 */
const lyricStyle = computed(() => {
  if (!Root.lineEnd || !Root.lineStart) {
    return { "--p": "0%" }
  }

  const now = audioPlayer.currentTime * 1000
  const progress =
    ((now - Root.lineStart) / (Root.lineEnd - Root.lineStart)) * 100

  return {
    "--p": `${Math.min(Math.max(progress, 0), 100)}%`
  }
})
</script>




<style scoped lang="less">
@active-pink: #ff85a2;

.lyric-container {
  padding: 40px;
  background: transparent;
  display: flex;
  justify-content: center;
}

.cyber-pink-lyric {
  position: relative;
  font-size: 32px;
  font-weight: 800;
  color: rgba(255, 133, 162, 0.25);

  &::before {
    content: attr(data-text);
    position: absolute;
    inset: 0;

    background: linear-gradient(
      to right,
      @active-pink var(--p),
      transparent var(--p)
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    /* 🌸 关键就在这 */
    transition: background-size 0.18s linear,
    background-position 0.18s linear;
  }
}

</style>
