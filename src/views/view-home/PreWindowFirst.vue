<template>
  <div class="page" @click="PictureAlbumVideo.nextPage">
    <div style="position: relative; height: 100%">
      <!--      <madoka-picture-album-card :left="SelfMsg.left" :top="SelfMsg.top">
        <pre-self-msg-slot />
      </madoka-picture-album-card>-->
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
      <madoka-picture-album-card>
        <pre-soul-ripple-slot />
      </madoka-picture-album-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getVideoUrl } from "@/utils/resource.ts";
import PreSelfMsgSlot from "@/views/PreSelfMsgSlot.vue";
import MadokaPictureAlbumCard from "@/components/MadokaPictureAlbumCard.vue";
import PreSoulRippleSlot from "@/views/SoulRippleSlot/PreSoulRippleSlot.vue";

const emits = defineEmits(["changeCurrent"]);

const PictureAlbumVideo = (() => {
  const nextPage = async () => {
    await Promise.all(Object.values(s.ref.value).map((v) => v.jump()));
    await sleep(1500)
    emits("changeCurrent");
  };
  const init = () => {
    setTimeout(async () => {
      s.hiddenVideo = true;
    }, 3000);
  };
  const s = reactive({
    hiddenVideo: false,
    ref: {
      value: {} as Record<number, InstanceType<typeof MadokaPictureAlbumCard>>,
      set: (v, index) => (s.ref.value[index] = v),
    },
    items: [
      { x: 0, y: 0, width: 17, zIndex: 1 },
      { x: 18, y: -12, width: 19 },
      { x: 48, y: -12, zIndex: 2 },
      { x: 62.3, y: 0 },
      { x: 74, y: -5 },
      { x: 15, y: 15, width: 10, height: 20, zIndex: 0 },
      { x: 26, y: 10, width: 17, height: 22, zIndex: 1 }, //6
      { x: 38, y: 0, width: 15 },
      { x: 49, y: 10, height: 22 },
      { x: 67, y: 7, width: 15, zIndex: 1 },
      { x: 88, y: 5, zIndex: 1, height: 25 },
      { x: 30, y: 33, width: 13 }, //11
      { x: 46, y: 33, width: 14, height: 25 },
      { x: 57, y: 25, height: 25, zIndex: 2 },
    ],
    nextPage,
  });
  init();
  return s;
})();
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
