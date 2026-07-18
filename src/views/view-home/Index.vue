<template>
  <home-header v-if="Tab.current === 1" />
  <div v-show="Tab.current === 0">
    <view-scene>
      <pre-window-first
        @change-current="() => (Tab.current = 1)"
        ref="firstRef"
      />
    </view-scene>
  </div>
  <pre-window-second v-if="Tab.current === 1" @back="Tab.back" />
  <view-player />
  <view-particle />
  <setting />
</template>

<script setup lang="ts">
import ViewScene from '../ViewScene.vue'
import ViewPlayer from '@/views/ViewPlayer.vue'
import ViewParticle from '@/views/ViewParticle.vue'
import PreWindowFirst from '@/views/view-home/PreWindowFirst.vue'
import PreWindowSecond from '@/views/view-home/PreWindowSecond.vue'
import HomeHeader from '@/views/view-home/HomeHeader.vue'
import Setting from '@/components/project/setting/Index.vue'
defineOptions({
  name: 'ViewHome',
})

const firstRef = useTemplateRef('firstRef')
const Tab = (() => {
  const back = () => {
    Tab.current = 0
    firstRef.value?.reduction()
  }
  const s = reactive({
    current: 0,
    back,
  })
  return s
})()
</script>

<style scoped></style>
