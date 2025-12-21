<template>
<!--  <view-scene>
    <pre-window-first/>
  </view-scene>-->
  <pre-window-second/>
  <view-player />
</template>

<script setup lang="tsx">
// 焰酱什么都准备好了～
import ViewScene from "../ViewScene.vue";
import ViewPlayer from "@/views/ViewPlayer.vue";
import PreWindowFirst from "@/views/view-home/PreWindowFirst.vue";
import PreWindowSecond from "@/views/view-home/PreWindowSecond.vue";
defineOptions({
  name: "ViewHome",
})
</script>

<style scoped>

</style>
