import { defineStore } from 'pinia'
import { computed } from 'vue'
import { getAudioUrl } from '@/utils/resource.ts'

type SongItem = {
  title: string
  artist?: string
  album?: string
  duration?: number
  isInstrumental?: boolean
}
const isInstrumental = true
export default defineStore("madokaAudioPlayer", () => {
  /** 歌单 */
  const songList: SongItem[] = [
    {
      //纯音乐
      title: 'never leave you alone',
      artist: '梶浦由記',
      album: '劇場版 魔法少女まどか☆マギカ[新編]叛逆の物語 オリジナルサウンドトラック',
      duration: 293,
      isInstrumental,
    },
    {
      //纯音乐
      title: '魔法少女のテーマ',
      artist: '梶浦由記',
      album: 'Best Instrumental Anime Songs',
      duration: 222,
      isInstrumental,
    },
    {
      //纯音乐
      title: 'Sagitta luminis',
      artist: '梶浦由記',
      album: '魔法少女まどか☆マギカ Music Collection',
      duration: 343,
      isInstrumental,
    },
    {
      //纯音乐
      title: '君の銀の庭[同人曲]',
      artist: 'オルゴール ミドリ',
      album: '劇場版 魔法少女まどか☆マギカ[新編]叛逆の物語 オリジナルサウンドトラック',
      duration: 266,
      isInstrumental,
    },
    {
      //纯音乐
      title: 'Decretum',
      artist: '梶浦由記',
      album: '魔法少女まどか☆マギカ Music Collection',
      duration: 109,
      isInstrumental,
    },
    {
      title: "Dreamin'",
      artist: 'ClariS',
      album: 'コネクト',
      duration: 277,
    },
    {
      title: 'コネクト',
      artist: 'ClariS',
      album: 'コネクト',
      duration: 271,
    },
    {
      title: 'キミとふたり',
      artist: 'ClariS',
      album: 'コネクト',
      duration: 254,
    },
    {
      title: 'ルミナス',
      artist: 'ClariS',
      album: 'ルミナス',
      duration: 248,
    },
    {
      title: 'blossom',
      artist: 'ClariS',
      album: 'ルミナス',
      duration: 248,
    },
    {
      title: 'Friends',
      artist: 'ClariS',
      album: 'ルミナス',
      duration: 231,
    },
    {
      title: 'Pieces',
      artist: 'ClariS',
      album: 'カラフル',
      duration: 258,
    },
    {
      title: 'Surely',
      artist: 'ClariS',
      album: 'カラフル',
      duration: 261,
    },
    {
      title: 'naturally',
      artist: '悠木碧/喜多村英梨',
      album: '「魔法少女まどか☆マギカ」 Ultimate Best',
      duration: 268,
    },
    //五彩斑斓
    {
      title: 'カラフル',
      artist: 'ClariS',
      album: 'カラフル',
      duration: 293,
    },
    //明天见
    {
      title: 'また あした',
      artist: 'ClariS',
      album: '魔法少女まどか☆マギカ Music Collection',
      duration: 264,
    },
    {
      title: "and I'm home",
      artist: '喜多村英梨/野中藍',
      album: '魔法少女まどか☆マギカ 5',
      duration: 169,
    },
    {
      title: 'Magia',
      artist: 'Kalafina',
      album: '「魔法少女まどか☆マギカ」 Ultimate Best',
      duration: 313,
    },
    {
      title: 'Mebius Ash',
      artist: '斎藤千和',
      album: '「魔法少女まどか☆マギカ」 Ultimate Best',
      duration: 203,
    },
    {
      title: 'misterioso',
      artist: 'Kalafina',
      album: 'Kalafina All Time Best 2008-2018',
      duration: 242,
    },
    {
      //纯音乐
      title: 'Pergo pugnare',
      artist: '梶浦由記',
      album: '魔法少女まどか☆マギカ Music Collection',
      duration: 139,
      isInstrumental,
    },
    {
      //纯音乐
      title: 'Sis puella magica!',
      artist: '梶浦由記/伊東恵里',
      album: '魔法少女まどか☆マギカ Music Collection',
      duration: 169,
      isInstrumental,
    },
    {
      title: 'Stairs',
      artist: '水橋かおり/野中藍',
      album: '「魔法少女まどか☆マギカ」 Ultimate Best',
      duration: 231,
    },
    {
      title: 'あこがれた咲いた',
      artist: '悠木碧',
      album: '「魔法少女まどか☆マギカ」 Ultimate Best',
      duration: 231,
    },
    {
      //纯音乐
      title: 'コネクト -ゲームインスト',
      artist: '梶浦由記',
      album: '「魔法少女まどか☆マギカ」 Music Collection',
      duration: 93,
      isInstrumental,
    },
    {
      title: 'ひかりふる',
      artist: 'Kalafina',
      album: '「魔法少女まどか☆マギカ」 Ultimate Best',
      duration: 293,
    },
    {
      title: 'また あした (Instrumental)',
      artist: '悠木碧',
      album: 'TVアニメ 魔法少女まどか☆マギカ 角色歌“また あした”',
      duration: 263,
      isInstrumental,
    },
    {
      title: 'ユメおと',
      artist: '悠木碧/斎藤千和',
      album: '「魔法少女まどか☆マギカ」 Ultimate Best',
      duration: 236,
    },
    {
      title: '君の銀の庭 (instrumental)',
      artist: 'Kalafina',
      album: '君の銀の庭',
      duration: 306,
      isInstrumental,
    },
    {
      title: '君の銀の庭',
      artist: 'Kalafina',
      album: '君の銀の庭',
      duration: 307,
    },
    {
      title: '未来 ～instrumental～',
      artist: 'Kalafina',
      album: 'ひかりふる',
      duration: 272,
      isInstrumental,
    },
    {
      title: '未来',
      artist: 'Kalafina',
      album: 'ひかりふる',
      duration: 272,
    },
    {
      title: '追憶',
      artist: 'Kalafina',
      album: '君の銀の庭',
      duration: 277,
    },
    {
      title: 'リンクス',
      artist: 'ClariS',
      album: 'リンクス',
      duration: 265,
    },
  ]

  const buildRandomList = () => {
    const list = songList.map((_, i) => i)

    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[list[i], list[j]] = [list[j], list[i]]
    }

    s.randomList = list
  }


  /** 当前歌曲 */
  const currentSong = computed(() => {
    return songList[s.current] ?? null
  })

  const next = async () => {
    if (!songList.length) return

    s.randomIndex = (s.randomIndex + 1) % songList.length
    s.current = s.randomList[s.randomIndex]
    s.playing = true

    const audio = s.ref.value
    if (!audio) return

    // 暂停上一个播放，重置时间
    audio.pause()
    audio.currentTime = 0
    audio.volume = s.volume

    try {
      await audio.play()
      if (s.randomIndex === s.randomList.length - 1) {
        buildRandomList()
      }
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
    s.randomIndex = (s.randomIndex - 1 + songList.length) % songList.length
    s.current = s.randomList[s.randomIndex]
    s.ref.value?.play()
    s.playing = true
  }

  const play = async (index: number = 0) => {
    s.current = index
    s.playing = true

    const audio = s.ref.value
    if (!audio) return

    audio.volume = s.volume

    try {
      timeupdate()
      await audio.play()
    } catch (e) {
      if ((e as DOMException).name !== "AbortError") {
        console.error(e)
      }
      // AbortError 可以忽略
    }
  }

  const playByName = (name?: string) => {
    if (!name) return
    const songIndex = songList.findIndex((item) => item.title === name)
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

  const seek = (number: number) => {
    s.currentTime = number
    s.ref.value.currentTime = number
  }

  /** 获取当前歌曲播放链接（供 <audio> 使用） */
  const currentUrl = computed(() => {
    const song = currentSong.value
    if (!song) return ""
    return getAudioUrl(`${song.title}.weba`)
  })

  const timeupdate = () => {
    requestAnimationFrame(timeupdate)
    const audio = s.ref.value
    if (!audio || !audio.duration) return
    s.currentTime = audio.currentTime
  }
  const s = reactive({
    ref: {
      set: (v) => (s.ref.value = v),
      value: null as HTMLAudioElement | null,
    },
    songList,
    randomList: [] as number[],
    randomIndex: 0,
    current: 28,
    currentTime: 0,
    volume: 0.5,
    currentSong,
    currentUrl,
    /** 状态 */
    playing: false,
    seek,
    next,
    play,
    prev,
    pause,
    resume,
    playByName,
    timeupdate,
    buildRandomList,
  })
  return toRefs(s)
})
