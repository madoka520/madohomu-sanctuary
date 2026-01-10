<template>
  <!-- 顶部导航 -->
  <nav class="flex nav" tabindex="-1">
    <div class="flex left-entry">
      <span class="mado">Mado</span><span class="homu">Homu</span>
      <span class="sanctuary"> Sanctuary </span>
    </div>
    <div class="center-entry">
    </div>
    <div class="right-entry">
      <madoka-player-controls playing class="show-with-hover" />
      <div class="avatar-frame" @click="settingRef?.open()">
        <img src="@/assets/images/madoka_pic/1.jpg" class="avatar" />
      </div>
    </div>
    <!--      <ul class="nav-links">
            <li><a href="#">焰之回廊</a></li>
          </ul>-->
    <setting ref="settingRef"/>
  </nav>
</template>

<script setup lang="ts">
import MadokaPlayerControls from "@/components/madoka-mini-player-controls/Index.vue"
import Setting from "@/components/project/setting/Index.vue"
const settingRef = useTemplateRef("settingRef")
</script>

<style scoped>
/* 导航 */
.show-with-hover {
  opacity: 0;
  transition: opacity 0.2s;
}
.nav {
  position: fixed;
  left: 0;
  right: 0;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  height: 60px;
  & > div {
    flex: 1;
  }
  &:hover,
  &:focus-within {
    background: rgba(255, 200, 220, 0.5);
    box-shadow: 0 4px 12px rgba(255, 128, 180, 0.2);
    backdrop-filter: blur(6px);
    .show-with-hover {
      opacity: 1;
    }
  }
}
.left-entry {
  font-size: 1.8rem;
  font-weight: bold;
  height: 100%;
  padding-left: 20px;
  padding-right: 10px;
  align-items: center;
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
}

.center-entry {
  display: flex;
  align-items: center;
  justify-content: center;
}

.right-entry {
  padding-right: 10px;
  display: flex;
  align-items: center;
  gap: 30px;
  .avatar-frame {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    padding: 2px;

    box-sizing: border-box;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    background: #fff;
  }
}
</style>
