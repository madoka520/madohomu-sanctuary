<template>
  <view-scene>
    <div class="page">
      <!-- 顶部导航 -->
      <nav class="nav">
        <div class="logo">
          <span class="mado">Mado</span><span class="homu">Homu</span>
          <span class="sanctuary"> Sanctuary </span>
        </div>
        <ul class="nav-links">
          <li><a href="#">焰之回廊</a></li>
        </ul>
      </nav>
      <div style="position: relative">
        <picture-album-card v-for="item in msgList" :msg="item" />
        <picture-album-card :left="SelfMsg.left" :top="SelfMsg.top">
          <pre-self-msg-slot/>
        </picture-album-card>
        <picture-album-card :background-image="madoka2"/>
        <picture-album-card :background-image="madoka3"/>
        <picture-album-card :background-image="madoka4"/>
        <picture-album-card background-video="/5.mp4"/>
        <picture-album-card>
          <pre-soul-ripple-slot/>
        </picture-album-card>
      </div>
    </div>
  </view-scene>
  <view-player/>
</template>

<script setup lang="ts">
// 焰酱什么都准备好了～
import ViewScene from "./ViewScene.vue";
import PictureAlbumCard from "@/components/PictureAlbumCard.vue";
import ViewPlayer from "@/views/ViewPlayer.vue";
import PreSelfMsgSlot from "@/views/PreSelfMsgSlot.vue";
import madoka2 from "@/assets/images/madoka_pic/2.jpg"
import madoka3 from "@/assets/images/madoka_pic/3.png"
import madoka4 from "@/assets/images/madoka_pic/4.jpg"
import PreSoulRippleSlot from "@/views/SoulRippleSlot/PreSoulRippleSlot.vue";
const msgList = [
  "要是别人说怀有希望是错误的事，不管几次我都一定会否定这句话，不管到什么时候。",
  "比希望更炽热 比绝望更深邃的 是爱",
  "轮回……无论几次，我依然选择轮回，无数次的探寻，寻找唯一的出口。寻找能将你从绝望命运中拯救出来的道路……鹿目圆，我唯一的朋友。为了你……即使陷入永恒的迷宫，我也会毫不介意！",
  "真正的心情怎么可以告诉你……因为我……我跟小圆处在不同的时间啊！我啊……是来自未来的喔……很多次很多次跟小圆相遇，然后无数次的目睹你的死……要怎样才能救你，要怎样怎能改变你的命运，只为了找到那个答案，无数次重新轮回。",
];
const SelfMsg = (() => {
  const s = reactive({
    left: computed(() => window.innerWidth / 2 - 100),
    top: computed(() => window.innerHeight / 2),
  })
  return s
})()
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
