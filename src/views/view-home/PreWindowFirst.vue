<template>
  <div class="page" @click="PictureAlbumVideo.nextPage">
    <!-- 顶部导航 -->
    <nav class="nav">
      <div class="logo">
        <span class="mado">Mado</span><span class="homu">Homu</span>
        <span class="sanctuary"> Sanctuary </span>
      </div>
<!--      <ul class="nav-links">
        <li><a href="#">焰之回廊</a></li>
      </ul>-->
    </nav>
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
  const nextPage = () => {
    emits("changeCurrent");
  };
  const init = () => {
    setTimeout(async () => {
      await Promise.all(Object.values(s.ref.value).map((v) => v.jump()));
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

/* 导航 */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 200, 220, 0.5);
  backdrop-filter: blur(6px);
  padding: 1rem 2rem;
  box-shadow: 0 4px 12px rgba(255, 128, 180, 0.2);
}

.mado {
  background: linear-gradient(135deg, #ff85a2, #ffb6c1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  text-shadow:
    0 0 2px white,
    0 1px 2px rgba(255, 120, 180, 0.5);
}

.homu {
  background: linear-gradient(135deg, #b388eb, #a470d1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  text-shadow:
    0 0 2px white,
    0 1px 2px rgba(170, 130, 255, 0.5);
}

.sanctuary {
  color: #a77bc7;
  margin-left: 0.4rem;
  text-shadow:
    0 0 2px white,
    0 1px 2px rgba(180, 140, 250, 0.5);
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
}

.nav-links a {
  text-decoration: none;
  color: #6d48a0;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #9b60c8;
}

.gallery img {
  width: 140px;
  height: auto;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(120, 80, 160, 0.3);
}
</style>
