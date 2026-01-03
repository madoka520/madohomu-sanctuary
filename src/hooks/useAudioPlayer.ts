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
  const songList = ref<SongItem[]>([
    {
      title: "また あした",
      artist: "ClariS",
      album: "コネクト",
    },
    // 后续可以 push 更多
  ])

  const instance = ref<HTMLAudioElement>(null)

  /** 状态 */
  const current = ref(0)
  const playing = ref(false) // 可以保留状态，但不操作播放

  /** 当前歌曲 */
  const currentSong = computed(() => {
    return songList.value[current.value] ?? null
  })

  /** 切换当前歌曲索引 */
  const setCurrent = (index: number) => {
    if (index < 0 || index >= songList.value.length) return
    current.value = index
  }

  /** 下一首 */
  const next = () => {
    if (!songList.value.length) return
    current.value = (current.value + 1) % songList.value.length
  }

  /** 上一首 */
  const prev = () => {
    if (!songList.value.length) return
    current.value = (current.value - 1 + songList.value.length) % songList.value.length
  }

  /** 获取当前歌曲播放链接（供 <audio> 使用） */
  const currentUrl = computed(() => {
    const song = currentSong.value
    if (!song) return ""
    return getAudioUrl(`${song.title}.weba`)
  })

  return {
    instance,
    songList,
    current,
    currentSong,
    playing,
    setCurrent,
    next,
    prev,
    currentUrl,
  }
})
