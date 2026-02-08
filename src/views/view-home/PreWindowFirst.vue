<template>
  <div class="page" @click="PictureAlbumVideo.nextPage">
    <div style="position: relative; height: 100%" v-once>
      <template v-for="(item, index) in PictureAlbumVideo.items">
        <madoka-picture-album-card
          :ref="(v) => PictureAlbumVideo.ref.set(v, index)"
          :hidden-video="PictureAlbumVideo.hiddenVideo"
          :left="item.x ?? null"
          :top="item.y ?? null"
          :background-video="getVideoUrl(`picture_album_${index + 1}.webm`)"
          :id="index"
          :width="item.width"
          :height="item.height"
          :z-index="item.zIndex"
          :msg="item.msg"
        >
          <component v-if="item.component" :is="item.component" />
        </madoka-picture-album-card>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getVideoUrl } from "@/utils/resource.ts"
import PreSelfMsgSlot from "@/views/PreSelfMsgSlot.vue"
import MadokaPictureAlbumCard from "@/components/MadokaPictureAlbumCard.vue"
import messageApi from "@/api/MessageApi.ts"

const emits = defineEmits(["changeCurrent"])

const PictureAlbumVideo = (() => {
  const nextPage = async () => {
    if (s.locked) return
    s.locked = true
    await Promise.all(Object.values(s.ref.value).map((v) => v.jump()))
    await sleep(1500)
    emits("changeCurrent")
    s.locked = false
  }
  const init = () => {
    /*    setTimeout(async () => {
      const res = (await messageApi.random()) as any
      s.items.forEach((item, index) => {
        item.msg = res.list[index].content
      })
      s.hiddenVideo = true
    }, 5000)*/
  }
  const reduction = async () => {
    await Promise.all(Object.values(s.ref.value).map((v) => v.reduction()))
  }
  const s = reactive({
    locked: false,
    hiddenVideo: false,
    ref: {
      value: {} as Record<number, InstanceType<typeof MadokaPictureAlbumCard>>,
      set: (v: any, index: number) => (s.ref.value[index] = v),
    },
    items: [
      { x: 0, y: 10, width: 17, zIndex: 1 },
      { x: 18, y: -2, width: 19 },
      { x: 48, y: -2, zIndex: 2 },
      { x: 62.3, y: 10 },
      { x: 74, y: 5 },
      { x: 15, y: 25, width: 10, height: 20, zIndex: 0 },
      { x: 26, y: 20, width: 17, height: 22, zIndex: 1 },
      { x: 38, y: 10, width: 15 },
      { x: 49, y: 20, height: 22 },
      { x: 67, y: 17, width: 15, zIndex: 1 },
      { x: 88, y: 15, zIndex: 1, height: 25 },
      { x: 30, y: 43, width: 13 },
      { x: 46, y: 43, width: 14, height: 25 },
      { x: 57, y: 35, height: 25, zIndex: 2 },
    ] as { x: number; y: number; width?: number; height?: number; zIndex?: number; msg?: string; component?: number }[],
    reduction,
    nextPage,
  })
  init()
  return s
})()
defineExpose({
  reduction: PictureAlbumVideo.reduction,
})
</script>

<style scoped>
.page {
  font-family: "Segoe UI", "Hiragino Sans", sans-serif;
  color: #4b2e83;
  height: 100vh;
  overflow: hidden;
}

.gallery img {
  width: 140px;
  height: auto;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(120, 80, 160, 0.3);
}
</style>
