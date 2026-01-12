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
      title: "never leave you alone",
      artist: "梶浦由記",
      album: "劇場版 魔法少女まどか☆マギカ[新編]叛逆の物語 オリジナルサウンドトラック",
    },
    {
      title: "魔法少女のテーマ",
      artist: "梶浦由記",
      album: "Best Instrumental Anime Songs",
    },
    {
      title: "Sagitta luminis",
      artist: "梶浦由記",
      album: "魔法少女まどか☆マギカ Music Collection",
    },
    {
      title: "君の銀の庭 _より",
      artist: "オルゴール ミドリ",
      album: "オルゴール アニメソングス!Vol.11 「劇場版 魔法少女まどか☆マギカ[新編]叛逆の物語」 「マギ」 他、特集!",
    },
    {
      title: "Decretum",
      artist: "梶浦由記",
      album: "魔法少女まどか☆マギカ Music Collection",
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
      album: "カラフル",
    },
    {
      title: "Surely",
      artist: "ClariS",
      album: "カラフル",
    },
    //五彩斑斓
    {
      title: "カラフル",
      artist: "ClariS",
      album: "カラフル",
    },
    //明天见
    {
      title: "また あした",
      artist: "ClariS",
      album: "魔法少女まどか☆マギカ Music Collection",
    },
    // 后续可以 push 更多
  ]

  /** 当前歌曲 */
  const currentSong = computed(() => {
    return songList[s.current] ?? null
  })

  const next = async () => {
    if (!songList.length) return

    s.current = (s.current + 1) % songList.length
    s.playing = true

    const audio = s.ref.value
    if (!audio) return

    // 暂停上一个播放，重置时间
    audio.pause()
    audio.currentTime = 0
    audio.volume = s.volume

    try {
      await audio.play()
    } catch (e) {
      if ((e as DOMException).name !== "AbortError") {
        console.error(e)
      }
      // AbortError 可以忽略
    }
  }


  /** 上一首 */
  const prev = () => {
    if (!songList.length) return
    s.current = (s.current - 1 + songList.length) % songList.length
    s.ref.value?.play()
    s.playing = true
  }

  const play = async (index?: number) => {
    let idx = index ?? 0
    s.current = idx
    s.playing = true

    const audio = s.ref.value
    if (!audio) return

    audio.volume = s.volume

    try {
      await audio.play()
    } catch (e) {
      if ((e as DOMException).name !== "AbortError") {
        console.error(e)
      }
      // AbortError 可以忽略
    }
  }


  const playByName = (name: string) => {
    const songIndex = songList.findIndex(item => item.title === name)
    play(songIndex)
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
    playByName,
  })
  return toRefs(s)
})
