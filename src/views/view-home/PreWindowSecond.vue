<template>
  <div class="app-container" v-lazy="Msg.init">
    <madoka-live2d />
    <pre-home-theme />
    <madoka-side-drawer
      @madoka-scroll="Scroll.madokaScroll"
      @handle-sent="() => dialogRef?.open()"
      :today-count="Msg.todayCount"
      @back="emits('back')"
    >
      <div class="scroll-row" ref="scrollRef" @wheel="Scroll.wheel">
        <madoka-msg-card
          v-for="item in Msg.list"
          :message="{
            ...item,
            userId: item.userId ?? item.externalUserId ?? -1,
            username: item.username ?? item.externalUsername,
            userUpdateTime: item.userUpdateTime ?? 0,
            likes: item.likes ?? 0,
            replies: item.replies ?? [],
          }"
          :key="`${item.createTime}${item.id}`"
          @like="(liked) => Msg.like(item, liked)"
          @handle-reply="(e) => dialogRef?.openReply(e)"
        />
      </div>
      <madoka-timeline @change="Msg.changeDate" v-model="Msg.currentDay" />
    </madoka-side-drawer>
    <pre-message-dialog ref="dialogRef" @ok="Msg.pushOne" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import MadokaSideDrawer from '@/components/MadokaSideDrawer.vue'
import MadokaMsgCard from '@/components/MadokaMsgCard.vue'
import MadokaTimeline from '@/components/MadokaTimeline.vue'
import PreHomeTheme from '@/components/project/pre-home-theme/Index.vue'
import MessageApi from '@/api/MessageApi.ts'
import MadokaLive2d from '@/components/MadokaLive2d.vue'
import dayjs from 'dayjs'
import { debounce, maxBy, minBy, uniqBy } from 'lodash-unified'
import PreMessageDialog from '@/views/message-dialog/PreMessageDialog.vue'
import messageApi from '@/api/MessageApi.ts'
import type { Message } from '@/types/Message.ts'

const scrollRef = useTemplateRef('scrollRef')
const dialogRef = useTemplateRef('dialogRef')
type IParams = {
  from?: number
  time?: number
  toward?: 'next' | 'prev'
}

const emits = defineEmits(['back'])
const Msg = (() => {
  const pushOne = (e) => {
    if (e.pid !== 0) {
      return
    }
    s.list.unshift(e)
    s.todayCount++
  }
  const changeDate = async (time: number) => {
    // 1. 状态初始化
    s.noMore = false
    s.list = []
    pageReset()
    delete s.params.from
    s.params.time = time

    // 2. 执行加载 (确保 getList 内部没有因为 loading 锁被挡住)
    // 注意：getList 内部执行时会自动设置 s.loading = true
    await getList()
    combine()
    // 3. 此时数据已经回到 s.list，等待 Vue 将 DOM 渲染出来
    await nextTick()

    if (scrollRef.value) {
      const el = scrollRef.value
      // 4. 重点：在调整位置前，先手动锁住，防止 scroll 事件触发 checkLoad
      s.loading = true

      // 稍微向右偏移一点点，1px 即可激活滚动层并避开 0 判定
      el.scrollLeft = 5

      // 5. 给予一个极短的延迟后解锁
      setTimeout(() => {
        s.loading = false
      }, 150)
    }
  }

  const next = async () => {
    s.params.toward = 'next'
    s.params.from = minBy(s.list, 'createTime')?.id! - 1
    await getList()
    combine()
  }

  const combine = () => {
    s.combineList = uniqBy(
      s.list,
      (item) => `${item.externalId}_${item.origin}`,
    )
  }

  const getList = async (next: boolean = true) => {
    if (s.loading || s.noMore) return
    s.loading = true
    try {
      const res = (await MessageApi.list(s.params)) as any
      if (!res.list || res.list.length === 0) {
        s.noMore = true
        return
      }
      if (next) {
        s.list.push(...res.list)
        return
      }
      s.list.unshift(...res.list)
    } finally {
      s.loading = false
    }
  }

  const getMsgMaxId = async () => {
    s.maxId = (await MessageApi.getMaxId()) as any
  }

  const getMaxTime = async () => {
    s.maxTime = (await MessageApi.getMaxTime()) as any
  }

  const pageReset = () => {
    s.params.toward = 'next'
  }

  const prev = async () => {
    s.params.toward = 'prev'
    if (!s.list.length) {
      s.params.time = s.currentDay
      s.loading = false

      return
    }
    if (s.list[0].createTime === s.maxTime) {
      return
    }
    s.params.from = maxBy(s.list, 'id')?.id
    await getList(false)
    combine()
  }

  const like = (item: Message, liked: number) => {
    item.liked = !!liked ? 0 : 1
    const add = !!liked ? -1 : 1
    item.likes += add
  }
  const getCount = async () => {
    s.todayCount = (await messageApi.count()) as unknown as number
  }

  const init = async () => {
    await getMaxTime()
    await getCount()
    await getList() // 初始化加载
    combine()
  }

  const s = reactive({
    params: { toward: 'next' } as IParams,
    currentDay: dayjs().valueOf(),
    maxId: 0,
    maxTime: 0,
    todayCount: 0,
    list: [] as Message[],
    combineList: [] as Message[],
    changeDate,
    getList,
    next,
    prev,
    noMore: false,
    loading: false,
    pushOne,
    like,
    init,
  })

  /**
   * 待机返回首页
   */
  onMounted(() => {
    const idle = useIdle(300000, {
      events: ['click', 'keydown', 'mousemove'],
    })

    watch(idle.idle, (isIdle) => {
      if (isIdle) {
        emits('back')
      }
    })
  })

  return s
})()

// 滚动逻辑
const Scroll = (() => {
  const wheel = async (e: WheelEvent) => {
    const el = scrollRef.value
    if (!el) return

    // 1. 查找真正负责滚动的内部容器
    const target = e.target as HTMLElement
    const scrollable = target.closest('.card__inner') as HTMLElement | null

    if (scrollable) {
      const { scrollTop, scrollHeight, clientHeight } = scrollable

      // 检查是否有垂直滚动的空间
      const hasScrollSpace = scrollHeight > clientHeight

      if (hasScrollSpace) {
        const isAtTop = scrollTop <= 0 && e.deltaY < 0
        const isAtBottom =
          scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0

        // 如果没到顶也没到底，说明正在垂直滚动，直接 return 让浏览器处理默认滚动
        if (!isAtTop && !isAtBottom) {
          return
        }
      }
    }

    // 2. 只有当：1.没有内部滚动条 2.内部滚动到了尽头 时，才执行外层水平滚动
    e.preventDefault()
    el.style.scrollBehavior = 'smooth'
    el.scrollLeft += e.deltaY * 8.08
    await checkLoadDebounce(el)
  }
  /**
   * 获取可见元素
   * @param container
   */
  const getVisibleCards = (container: HTMLElement) => {
    const containerRect = container.getBoundingClientRect()
    const cards = Array.from(container.querySelectorAll<HTMLElement>('.card'))

    let leftMost: HTMLElement | null = null
    let rightMost: HTMLElement | null = null

    for (const card of cards) {
      const rect = card.getBoundingClientRect()

      // 判断是否横向可见
      const isVisible =
        rect.right > containerRect.left && rect.left < containerRect.right

      if (!isVisible) continue

      if (!leftMost || rect.left < leftMost.getBoundingClientRect().left) {
        leftMost = card
      }

      if (!rightMost || rect.right > rightMost.getBoundingClientRect().right) {
        rightMost = card
      }
    }

    return {
      left: leftMost,
      right: rightMost,
    }
  }

  const checkLoad = async (el: HTMLElement) => {
    if (Msg.loading) return // 必须同时检查两个锁

    const scrollLeft = el.scrollLeft
    const maxScrollLeft = el.scrollWidth - el.clientWidth
    const threshold = 1 // 稍微加大一点点

    //  向右加载
    if (scrollLeft >= maxScrollLeft - threshold && !Msg.noMore) {
      await Msg.next()
    }

    //  向左加载
    if (scrollLeft <= threshold) {
      const oldScrollWidth = el.scrollWidth
      el.style.scrollBehavior = 'auto'

      await Msg.prev()

      const newScrollWidth = el.scrollWidth
      const diff = newScrollWidth - oldScrollWidth

      if (diff > 0) {
        // 这里的 +5 是关键，确保加载完后不在触发区，用户可以顺利向右滑
        el.scrollLeft = diff + 5
      }
      el.style.scrollBehavior = 'smooth'
    }
    await sleep(1000)
    const { left, right } = getVisibleCards(el)
    if (scrollLeft <= threshold) {
      Msg.currentDay = +left!.dataset!.time!
    } else {
      Msg.currentDay = +right!.dataset!.time!
    }
  }
  const checkLoadDebounce = debounce(checkLoad, 100) // 防抖检查加载

  // 1. 状态对象必须放在函数外面，确保它是持久的
  const ScrollState = {
    v: 0, // 速度
    rafId: 0, // 动画帧 ID
    friction: 0.95, // 摩擦力
  }

  const madokaScroll = ({ delta, el: e }) => {
    const el = scrollRef.value
    if (!el) return
    if (ScrollState.rafId) {
      cancelAnimationFrame(ScrollState.rafId)
      ScrollState.rafId = 0
    }
    el.style.scrollBehavior = 'auto'

    // ✅ 跟手位移：严格 1:1
    el.scrollLeft += delta

    // 记录最后一次输入作为惯性初速度
    ScrollState.v = delta

    // --- 新增：延迟启动惯性 ---
    if ((ScrollState as any)._startTimer) {
      clearTimeout((ScrollState as any)._startTimer)
    }

    ;(ScrollState as any)._startTimer = setTimeout(() => {
      // 如果已经有惯性在跑，不重复开
      if (ScrollState.rafId) return

      const step = () => {
        if (Math.abs(ScrollState.v) > 0.5) {
          el.scrollLeft += ScrollState.v

          ScrollState.v *= ScrollState.friction

          const isAtLeft = el.scrollLeft <= 0
          const isAtRight = el.scrollLeft >= el.scrollWidth - el.clientWidth

          if (isAtLeft || isAtRight) {
            ScrollState.v = 0
          }

          checkLoad(el)

          ScrollState.rafId = requestAnimationFrame(step)
        } else {
          ScrollState.v = 0
          ScrollState.rafId = 0
        }
      }

      ScrollState.rafId = requestAnimationFrame(step)
    }, 16) // 一帧内没有新输入，认为已经松手
  }

  return reactive({ wheel, madokaScroll })
})()
</script>

<style scoped>
.scroll-row {
  display: flex;
  overflow-x: auto;
  width: 100%;
  flex-wrap: nowrap;
  white-space: nowrap;
  scroll-behavior: smooth;
  user-select: none;
}

.loading-tip {
  text-align: center;
  padding: 6px 0;
  color: #ff4d6d;
  font-weight: bold;
}
</style>
