<template>
  <div class="timeline-wrapper" ref="wrapperRef">
    <div class="timeline" ref="scrollRef" @wheel="Scroll.wheel">
      <div v-for="year in TimeLine.getYears()" :key="year" class="year">
        <div class="number">
          {{ year }}
        </div>
        <div v-for="month in Array.from({ length: 12 }, (_, i) => 12 - i)" class="month-wrapper">
          <div class="month number" @mouseenter="DateCard.showDateCard(year, month, $event)" @mouseleave="DateCard.hideDateCard">
            {{ month }}
          </div>
        </div>
      </div>
    </div>
    <div v-show="DateCard.visible" :style="DateCard.style" class="date-card" @mouseenter="DateCard.keepDateCard" @mouseleave="DateCard.hideDateCard">
      <div v-for="day in DateCard.days" class="day" @click="TimeLine.dayClick(day)">
        {{ day }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
const scrollRef = useTemplateRef("scrollRef")
const wrapperRef = useTemplateRef("wrapperRef")
const emits = defineEmits(["change"])

const TimeLine = (() => {
  // 返回从 startYear 到 endYear 的年份数组
  const getYears = () => Array.from({ length: s.currentYear - 2019 + 1 }, (_, i) => 2019 + i).reverse()
  const dayClick = (day: number) => {
    emits("change", dayjs(`${DateCard.hoverYear}-${DateCard.hoverMonth}-${day}`, "YYYY-MM-DD").endOf("day").valueOf())
    DateCard.hideDateCard()
  }
  const s = reactive({
    currentYear: dayjs().year(),
    dayClick,
    getYears,
  })
  return s
})()
const DateCard = (() => {
  const showDateCard = (year: number, month: number, e: MouseEvent) => {
    const daysInMonth = dayjs()
      .year(year)
      .month(month - 1)
      .date(1)
      .daysInMonth()
    s.days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    s.hoverYear = year
    s.hoverMonth = month
    const monthEl = e.target as HTMLElement
    const wrapperEl = wrapperRef.value!

    const monthRect = monthEl.getBoundingClientRect()
    const wrapperRect = wrapperEl.getBoundingClientRect()

    s.style.left = `${monthRect.left - wrapperRect.left + monthRect.width / 2}px`
    s.style.top = `${monthRect.top - wrapperRect.top - 12}px`

    s.visible = true

    // 进入显示时清理隐藏定时器
    if (s.timer) {
      clearTimeout(s.timer)
      s.timer = null
    }
  }

  const hideDateCard = () => {
    // 先清理之前的定时器
    if (s.timer) clearTimeout(s.timer)

    s.timer = window.setTimeout(() => {
      s.visible = false
      s.timer = null
    }, 100)
  }

  const keepDateCard = () => {
    s.visible = true
    // 鼠标进入时也清理隐藏定时器
    if (s.timer) {
      clearTimeout(s.timer)
      s.timer = null
    }
  }

  const s = reactive({
    style: {
      left: "-10000px",
      top: "-10000px",
    },
    days: [] as number[],
    hoverYear: -1,
    hoverMonth: -1,
    timer: null as number | null,
    visible: false,
    showDateCard,
    hideDateCard,
    keepDateCard,
  })
  return s
})()

const Scroll = (() => {
  const wheel = (e: WheelEvent) => {
    const el = scrollRef.value
    if (!el) return

    const target = e.target as HTMLElement

    // 找最近的可纵向滚动父元素
    const scrollable = target.closest(".card") as HTMLElement | null

    if (scrollable) {
      const { scrollTop, scrollHeight, clientHeight } = scrollable

      const isAtTop = scrollTop === 0 && e.deltaY < 0
      const isAtBottom = scrollTop + clientHeight >= scrollHeight && e.deltaY > 0

      // 👉 内部还能滚，就放行
      if (!isAtTop && !isAtBottom) {
        return
      }
    }

    // 👉 内部滚不动了，交给横向
    e.preventDefault()
    el.scrollLeft += e.deltaY * 4
  }

  return reactive({ wheel })
})()
</script>

<style scoped>
.timeline-wrapper {
  position: relative;
}
.timeline {
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  height: 20px;
  display: flex;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: drop-shadow(0 0) blur(1vh);
  box-shadow: 0 0 0.25rem 0.125rem rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s;
  color: white;
  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .year {
    display: flex;
    align-items: center;
    border-radius: 9999px; /* 或者 12px / 16px */
    padding-left: 10px;
    padding-right: 10px;
    &:hover {
      background: rgba(255, 255, 255, 0.3);
      backdrop-filter: drop-shadow(0 0) blur(1vh);
    }

    .number {
      padding: 5px;
      user-select: none;
      transition:
        transform 0.2s ease,
        color 0.2s ease;
      &:hover {
        transform: scale(1.3);
        color: #ffbbdd;
      }
    }
  }
}

.date-card {
  position: absolute;
  margin-bottom: 8px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  transform: translate(-50%, -100%);
  padding: 8px 10px;
  border-radius: 12px;

  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  box-shadow:
    0 0 20px rgba(255, 255, 255, 0.25),
    0 0 40px rgba(255, 255, 255, 0.15);

  color: white;
  font-size: 12px;

  transition:
    opacity 0.2s ease,
    transform 0.2s ease;

  &::after {
    content: "";
    position: absolute;

    left: 50%;
    top: 100%;
    transform: translateX(-50%);

    width: 0;
    height: 0;

    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid rgba(0, 0, 0, 0.7);
  }
  .day {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    user-select: none;
    transition: background 0.15s ease;
  }

  .day:hover {
    background: rgba(255, 187, 221, 0.35);
  }
}
</style>
