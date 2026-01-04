import { defineStore } from "pinia"
import { computed } from "vue"
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
      title: "Dreamin'",
      artist: "ClariS",
      album: "コネクト",
    },
    {
      title: "コネクト",
      artist: "ClariS",
      album: "コネクト",
    },
    {
      title: "キミとふたり",
      artist: "ClariS",
      album: "コネクト",
    },
    {
      title: "ルミナス",
      artist: "ClariS",
      album: "ルミナス",
    },
    {
      title: "blossom",
      artist: "ClariS",
      album: "ルミナス",
    },
    {
      title: "Friends",
      artist: "ClariS",
      album: "ルミナス",
    },
    {
      title: "Pieces",
      artist: "ClariS",
      album: "カラフル"
    },
    {
      title: "Surely",
      artist: "ClariS",
      album: "カラフル"
    },
    //五彩斑斓
    {
      title: "カラフル",
      artist: "ClariS",
      album: "カラフル"
    },
    //明天见
    {
      title: "また あした",
      artist: "ClariS",
      album: "",
    },
    // 后续可以 push 更多
  ]

  /** 当前歌曲 */
  const currentSong = computed(() => {
    return songList[s.current] ?? null
  })

  /** 下一首 */
  const next = () => {
    if (!songList.length) return
    s.current = (s.current + 1) % songList.length
    s.ref.value?.play()
    s.playing = true
  }

  /** 上一首 */
  const prev = () => {
    if (!songList.length) return
    s.current = (s.current - 1 + songList.length) % songList.length
    s.ref.value?.play()
    s.playing = true
  }

  const play = (index?: number) => {
    let idx = index
    s.playing = true
    if (index === undefined) {
      idx = 0
    }
    s.current = idx

    s.ref.value!.volume = s.volume
    s.ref.value?.play()
  }

  const pause = () => {
    s.ref.value?.pause()
    s.playing = false
  }

  const resume = () => {
    s.ref.value?.play()
    s.playing = true
  }

  /** 获取当前歌曲播放链接（供 <audio> 使用） */
  const currentUrl = computed(() => {
    const song = currentSong.value
    if (!song) return ""
    return getAudioUrl(`${song.title}.weba`)
  })

  const s = reactive({
    ref: {
      set: (v) => (s.ref.value = v),
      value: null as HTMLAudioElement | null,
    },
    songList,
    current: 0,
    volume: 0.5,
    currentSong,
    currentUrl,
    /** 状态 */
    playing: false,
    next,
    play,
    prev,
    pause,
    resume,
  })
  return toRefs(s)
})
