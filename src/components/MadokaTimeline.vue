<template>
  <div class="timeline" ref="scrollRef" @wheel="Scroll.wheel">
    <div v-for="year in TimeLine.currentYear - 2018" :key="year" class="year">
      <div class="number">
        {{ TimeLine.currentYear - year + 1 }}
      </div>
      <div v-for="month in 12" class="month-wrapper" >
        <div class="month number" @mouseenter="DateCard.showDateCard(year, month, $event)"
             @mouseleave="DateCard.hideDateCard('month')">
          {{ month }}
        </div>
      </div>
    </div>
  </div>

  <div
    v-show="DateCard.hovered.month || DateCard.hovered.day"
    :style="DateCard.style"
    class="date-card"
    @mouseenter="DateCard.keepDateCard"
    @mouseleave="DateCard.hideDateCard('day')"
  >
    <div
      v-for="day in DateCard.days"
      class="day"
    >
      {{ day }}
    </div>
  </div>

</template>

<script setup lang="ts">
import dayjs from "dayjs";
const scrollRef = useTemplateRef("scrollRef");
const TimeLine = (() => {
  const s = reactive({
    currentYear: dayjs().year(),
  });
  return s;
})();
const DateCard = (() => {
  const showDateCard = (year: number, month: number, e: MouseEvent) => {
    s.days = Array.from(
      { length: dayjs(`${year}-${month}-01`).daysInMonth() },
      (_, i) => i + 1
    )

    const rect = (e.target as HTMLElement).getBoundingClientRect()

    s.style.left = `${rect.left + rect.width / 2}px`
    s.style.top = `${rect.top - 12}px`

    s.hovered.month = true
  }

  const keepDateCard = () => {
    s.hovered.day = true
  };
  const hideDateCard =  (type: "day" | "month") => {
    setTimeout(() => {
      s.hovered[type] = false
    }, 100)
  }
  const s = reactive({
    style: {
      left: '-10000px',
      top: '-10000px',
    },
    days: [] as number[],
    hovered: {
      day: false,
      month: false,
    },
    showDateCard,
    hideDateCard,
    keepDateCard
  });
  return s;
})();
const Scroll = (() => {
  const wheel = (e: WheelEvent) => {
    const el = scrollRef.value;
    if (!el) return;

    const target = e.target as HTMLElement;

    // 找最近的可纵向滚动父元素
    const scrollable = target.closest(".card") as HTMLElement | null;

    if (scrollable) {
      const { scrollTop, scrollHeight, clientHeight } = scrollable;

      const isAtTop = scrollTop === 0 && e.deltaY < 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight && e.deltaY > 0;

      // 👉 内部还能滚，就放行
      if (!isAtTop && !isAtBottom) {
        return;
      }
    }

    // 👉 内部滚不动了，交给横向
    e.preventDefault();
    el.scrollLeft += e.deltaY * 20;
  };

  return reactive({ wheel });
})();
</script>

<style scoped>
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

    transition: background 0.15s ease;
  }

  .day:hover {
    background: rgba(255, 187, 221, 0.35);
  }
}
</style>
