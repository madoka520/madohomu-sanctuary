<template>
  <div class="app-container">
<!--    <madoka-live2d />-->
    <pre-home-theme />
    <madoka-side-drawer @madoka-scroll="Scroll.madokaScroll" @ok="Msg.pushOne">
      <div class="scroll-row" ref="scrollRef" @wheel="Scroll.wheel">
        <madoka-msg-card
          v-for="item in Msg.list"
          :key="item.userId ?? item.externalUserId"
          :content="item.content"
          :create-time="item.createTime"
          :uid="item.userId ?? item.externalUserId"
          :username="item.username ?? item.externalUsername"
          :external-id="item.externalId"
          :origin="item.origin"
          :update-time="item.updateTime"
        />
      </div>
      <madoka-timeline @change="Msg.changeDate" />
    </madoka-side-drawer>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import MadokaSideDrawer from "@/components/MadokaSideDrawer.vue"
import MadokaMsgCard from "@/components/MadokaMsgCard.vue"
import MadokaTimeline from "@/components/MadokaTimeline.vue"
import PreHomeTheme from "@/components/project/pre-home-theme/Index.vue"
import MessageApi from "@/api/MessageApi.ts"
import emitter from "@/utils/emitter.ts"
import MadokaLive2d from "@/components/MadokaLive2d.vue"

const scrollRef = useTemplateRef("scrollRef")
type IParams = {
  from?: number
  page: number
  pageSize: number
  createTime?: number
}
const Msg = (() => {
  const pushOne = (e) => {
    s.list.unshift(e)
  }
  const changeDate = async (time: number) => {
    // 1. 状态初始化
    s.noMore = false
    s.list = []
    pageReset()
    delete s.params.from
    s.params.createTime = time

    // 2. 执行加载 (确保 getList 内部没有因为 loading 锁被挡住)
    // 注意：getList 内部执行时会自动设置 s.loading = true
    await getList()

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
    if (s.params.page <= 0) {
      s.params.page = 1
    } else {
      s.params.page++
    }
    await getList()
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
      s.list.unshift(...res.list.reverse())
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
    s.params.page = 1
    s.params.pageSize = 10
  }

  const prev = async () => {
    if (s.leftLoading) return
    s.leftLoading = true
    if (s.list[0].createTime === s.maxTime) {
      s.leftLoading = false
      return
    }
    s.params.from = s.list[0].id
    s.params.page--
    if (s.params.page === 0) {
      s.params.page--
    }
    await getList(false)
    await sleep(500)
    s.leftLoading = false
  }

  const s = reactive({
    params: { pageSize: 10, page: 1 } as IParams,
    maxId: 0,
    maxTime: 0,
    list: [] as {
      id: number
      content: string
      createTime: number
      userId: number
      externalUsername: string
      externalUserId: number
      username: string
      externalId: number
      origin: string
      updateTime: number
    }[],
    changeDate,
    getList,
    next,
    prev,
    noMore: false,
    loading: false,
    leftLoading: false,
    pushOne,
  })

  getList() // 初始化加载
  getMaxTime()
  return s
})()

// 滚动逻辑
const Scroll = (() => {
  const wheel = async (e: WheelEvent) => {
    await nextTick()
    const el = scrollRef.value
    if (!el) return

    const target = e.target as HTMLElement
    const scrollable = target.closest(".card") as HTMLElement | null

    if (scrollable) {
      const { scrollTop, scrollHeight, clientHeight } = scrollable
      const isAtTop = scrollTop === 0 && e.deltaY < 0
      const isAtBottom = scrollTop + clientHeight >= scrollHeight && e.deltaY > 0
      if (!isAtTop && !isAtBottom) return
    }

    e.preventDefault()
    el.scrollLeft += e.deltaY * 8.08
    await checkLoad(el)
  }

  const checkLoad = async (el: HTMLElement) => {
    if (Msg.loading || Msg.leftLoading) return // 必须同时检查两个锁

    const scrollLeft = el.scrollLeft
    const maxScrollLeft = el.scrollWidth - el.clientWidth
    const threshold = 1 // 稍微加大一点点

    // 👉 向右加载
    if (scrollLeft >= maxScrollLeft - threshold && !Msg.noMore) {
      await Msg.next()
    }

    // 👉 向左加载
    if (scrollLeft <= threshold) {
      const oldScrollWidth = el.scrollWidth

      await Msg.prev()

      await nextTick()
      const newScrollWidth = el.scrollWidth
      const diff = newScrollWidth - oldScrollWidth

      if (diff > 0) {
        // 这里的 +5 是关键，确保加载完后不在触发区，用户可以顺利向右滑
        el.scrollLeft = diff + 5
      }
    }
  }

  // 1. 状态对象必须放在函数外面，确保它是持久的
  const ScrollState = {
    v: 0, // 速度
    rafId: 0, // 动画帧 ID
    friction: 0.95, // 摩擦力
  }

  const madokaScroll = ({ delta, el: e }) => {
    const el = scrollRef.value
    if (!el) return

    // 2. 核心修复：强制关闭 CSS 平滑滚动，否则 JS 动画会失效
    el.style.scrollBehavior = "auto"

    // 3. 设置初始冲力 (delta 可以是鼠标滚轮的 deltaY 或固定值)
    // 如果你想向右滑，初始速度设为正数
    ScrollState.v = 30 * 8.08 * delta
    // 停止之前的动画，防止多个动画叠加导致越来越快
    cancelAnimationFrame(ScrollState.rafId)

    const step = () => {
      // 只要速度绝对值大于 0.5 就继续跑
      if (Math.abs(ScrollState.v) > 0.5) {
        // 执行位移
        el.scrollLeft += ScrollState.v

        // 模拟摩擦力衰减
        ScrollState.v *= ScrollState.friction

        // 边缘检测：如果撞墙了就立刻停止，防止浪费性能
        const isAtLeft = el.scrollLeft <= 0
        const isAtRight = el.scrollLeft >= el.scrollWidth - el.clientWidth

        if (isAtLeft || isAtRight) {
          ScrollState.v = 0
        }

        // 触发加载更多逻辑
        checkLoad(el)

        ScrollState.rafId = requestAnimationFrame(step)
      } else {
        ScrollState.v = 0
        el.style.scrollBehavior = "smooth"
      }
    }

    ScrollState.rafId = requestAnimationFrame(step)
  }

  return reactive({ wheel, madokaScroll })
})()
</script>

<style scoped>
.app-container {
  width: 100vw;
  height: 100vh;
}

.scroll-row {
  display: flex;
  overflow-x: auto;
  width: 100%;
  flex-wrap: nowrap;
  white-space: nowrap;
  scroll-behavior: smooth;

  user-select: none;
  scrollbar-width: thin; /* Firefox */
}
.scroll-row::-webkit-scrollbar {
  height: 6px;
}
.scroll-row::-webkit-scrollbar-thumb {
  background: #ffb7c5;
  border-radius: 3px;
}
.scroll-row::-webkit-scrollbar-track {
  background: #fff5f7;
}

.loading-tip {
  text-align: center;
  padding: 6px 0;
  color: #ff4d6d;
  font-weight: bold;
}
</style>
