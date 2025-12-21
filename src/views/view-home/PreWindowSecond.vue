<template>
  <div class="app-container">
    <madoka-side-drawer>
      <div class="scroll-row" ref="scrollRef" @wheel="Scroll.wheel">
        <madoka-msg-card v-for="item in Msg.list" class="card">
          {{ item.comment }}
        </madoka-msg-card>
      </div>
    </madoka-side-drawer>
  </div>
</template>

<script setup lang="ts">
import MadokaSideDrawer from "@/components/MadokaSideDrawer.vue";
import axios from "axios";
import MadokaMsgCard from "@/components/MadokaMsgCard.vue";
const scrollRef = useTemplateRef("scrollRef")


const Msg = (() => {
  const getList = async () => {
    const res = await axios.get("/haojiezhe-api/madohomu/api/comments")
    s.list = res.data
  };
  const s = reactive({
    list: [] as { comment: string }[]
  });
  getList()
  return s;
})();

const Scroll = (() => {

  const wheel = (e: WheelEvent) => {
    e.preventDefault()

    const el = scrollRef.value
    if (!el) return

    // ⭐⭐ 关键：直接改 scrollLeft —— 最跟手、最不卡
    el.scrollLeft += e.deltaY * 20   // 越大越快
  }

  return reactive({ wheel })
})();


</script>

<style scoped>
.app-container {
  background: url("/dev-cdn/images/madoka.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100vh;

}

.scroll-row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 4px;
  padding-left: 20px;
  width: 100vw;
  /* 横向滚动关键点 */
  flex-wrap: nowrap;   /* 不换行 */
  white-space: nowrap;

  /* 平滑滚动（在移动端很好用） */
  scroll-behavior: smooth;

  /* 隐藏难看的滚动条（保留滚动功能） */
  scrollbar-width: none;     /* Firefox */
}
.scroll-row::-webkit-scrollbar {
  display: none;             /* Chrome/Safari */
}



</style>
