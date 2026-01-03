import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { getAudioUrl } from "@/utils/resource.ts"

type SongItem = {
  title: string
  artist?: string
  album?: string
  duration?: number
}

export default defineStore("madokaAudioPlayer", () => {
  /** 歌单 */
  const songList: SongItem[] = [
    {
      title: "魔法少女のテーマ",
      artist: "梶浦由記",
      album: "Best Instrumental Anime Songs",
    },
    {
      title: "コネクト",
      artist: "ClariS",
      album: "「魔法少女まどか☆マギカ」 Ultimate Best",
    },
    {
      title: "また あした",
      artist: "ClariS",
      album: "コネクト",
    },
    // 后续可以 push 更多
  ]

  const playing = ref(false)

  const current = ref(0)

  /** 当前歌曲 */
  const currentSong = computed(() => {
    return songList[current.value] ?? null
  })

  /** 下一首 */
  const next = () => {
    if (!songList.length) return
    current.value = (current.value + 1) % songList.length
    s.ref.value?.play()
  }

  /** 上一首 */
  const prev = () => {
    if (!songList.length) return
    current.value = (current.value - 1 + songList.length) % songList.length
    s.ref.value?.play()
  }

  const play = (index?: number) => {
    let idx = index
    playing.value = true
    if (index === undefined) {
      idx = 0
    }
    current.value = idx

    s.ref.value!.volume = s.volume
    s.ref.value?.play()
  }

  const pause = () => {
    s.ref.value?.pause()
    playing.value = false
  }

  const resume = () => {
    s.ref.value?.play()
    playing.value = true
  }

  /** 获取当前歌曲播放链接（供 <audio> 使用） */
  const currentUrl = computed(() => {
    const song = currentSong.value
    if (!song) return ""
    return getAudioUrl(`${song.title}.weba`)
  })

  const s = {
    ref: {
      set: (v) => (s.ref.value = v),
      value: null as HTMLAudioElement | null,
    },
    songList,
    current,
    volume: 0.5,
    currentSong,
    currentUrl,
    /** 状态 */
    playing,
    next,
    play,
    prev,
    pause,
    resume,
  }

  return s
})
