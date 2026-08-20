import { defineStore } from 'pinia'
import { computed } from 'vue'
import { getAudioUrl } from '@/utils/resource.ts'
// [Ethan] 音频缓存管线：L1 Map → L2 IndexedDB → Gitee API → Blob URL
import { loadGiteeAudio, preloadGiteeAudio } from '@/utils/audioCache.ts'

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

  /*
  [原代码] 直接 audio.play()，无缓存加载
  const next = async () => {
    if (!songList.length) return
    s.randomIndex = (s.randomIndex + 1) % songList.length
    s.current = s.randomList[s.randomIndex]
    s.playing = true
    const audio = s.ref.value
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    audio.volume = s.volume
    try {
      await audio.play()
      if (s.randomIndex === s.randomList.length - 1) { buildRandomList() }
    } catch (e) { ... }
  }
  */
  // [Ethan] 异步加载音频 → Blob URL 后再播放，播完预加载下一首
  const next = async () => {
    if (!songList.length) return

    s.randomIndex = (s.randomIndex + 1) % songList.length
    s.current = s.randomList[s.randomIndex]
    s.playing = true

    const audio = s.ref.value
    if (!audio) return

    audio.pause()
    audio.currentTime = 0
    audio.volume = s.volume

    await s._loadAndSetSrc()

    try {
      await audio.play()
      if (s.randomIndex === s.randomList.length - 1) {
        buildRandomList()
      }
      s._preloadNext()
    } catch (e) {
      if ((e as DOMException).name !== "AbortError") {
        console.error(e)
      }
    }
  }

  /** 上一首 */
  /*
  [原代码] 无缓存加载
  const prev = () => { ... }
  */
  // [Ethan] 异步加载后播放
  const prev = async () => {
    if (!songList.length) return
    s.randomIndex = (s.randomIndex - 1 + songList.length) % songList.length
    s.current = s.randomList[s.randomIndex]
    s.playing = true

    await s._loadAndSetSrc()

    s.ref.value?.play()
    s._preloadNext()
  }

  /*
  [原代码] 直接设置 current（触发 computed currentUrl）后 play，无缓存
  const play = async (index: number = 0) => { ... }
  */
  // [Ethan] 异步加载 → Blob URL → 播放
  const play = async (index: number = 0) => {
    s.current = index
    s.playing = true

    const audio = s.ref.value
    if (!audio) return

    audio.volume = s.volume

    await s._loadAndSetSrc()

    try {
      timeupdate()
      await audio.play()
      s._preloadNext()
    } catch (e) {
      if ((e as DOMException).name !== "AbortError") {
        console.error(e)
      }
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
  /*
  [原代码] CDN 直链，无缓存
  const currentUrl = computed(() => {
    const song = currentSong.value
    if (!song) return ""
    return getAudioUrl(`${song.title}.weba`)
  })
  */
  // [Ethan] 改为异步加载管线设置 Blob URL，不再通过此 computed 提供 src
  // currentUrl 保留为 reactive string，由 _loadAndSetSrc 写入 blob URL

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
    // [Ethan] currentUrl 改为 reactive string，由 _loadAndSetSrc 写入 Blob URL
    // [原代码] currentUrl: computed(() => getAudioUrl(...))
    currentUrl: '',
    // [Ethan] 当前 Blob URL 的 revoke 句柄，切歌时调用
    _blobRevoke: null as (() => void) | null,
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
    // [Ethan] 异步加载当前歌曲 → Blob URL → 写入 currentUrl + audio.src
    _loadAndSetSrc: async () => {
      const song = currentSong.value
      if (!song) return

      // 释放上一首的 Blob URL
      s._blobRevoke?.()
      s._blobRevoke = null

      const src = getAudioUrl(`${song.title}.weba`)
      try {
        const handle = await loadGiteeAudio(src)
        s._blobRevoke = handle.revoke
        s.currentUrl = handle.blobUrl
        // 同步写入 audio 元素（ViewPlayer 的 :src 绑定可能尚未触发更新时）
        if (s.ref.value) {
          s.ref.value.src = handle.blobUrl
        }
      } catch (e) {
        console.error('[AudioPlayer] 加载失败:', song.title, e)
      }
    },
    // [Ethan] 预加载随机列表中的下一首
    _preloadNext: () => {
      const nextIndex = (s.randomIndex + 1) % songList.length
      const nextSong = songList[s.randomList[nextIndex]]
      if (!nextSong) return
      const src = getAudioUrl(`${nextSong.title}.weba`)
      preloadGiteeAudio(src).catch(() => {})
    },
  })
  return toRefs(s)
})
