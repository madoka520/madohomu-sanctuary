<template>
  <home-header v-if="Tab.current === 1"/>
  <div v-show="Tab.current === 0">
    <view-scene>
      <pre-window-first @change-current="() => Tab.current = 1" />
    </view-scene>
  </div>
  <pre-window-second v-if="Tab.current === 1" />
  <view-player />
  <view-particle />
</template>

<script setup lang="tsx">
import ViewScene from "../ViewScene.vue";
import ViewPlayer from "@/views/ViewPlayer.vue";
import ViewParticle from "@/views/ViewParticle.vue";
import PreWindowFirst from "@/views/view-home/PreWindowFirst.vue";
import PreWindowSecond from "@/views/view-home/PreWindowSecond.vue";
import HomeHeader from "@/views/view-home/HomeHeader.vue";
defineOptions({
  name: "ViewHome",
});

const Tab = (() => {
  const s = reactive({
    current: 0,
  });
  return s;
})();
</script>

<style scoped>

</style>
