<template>
  <madoka-mask v-model="modelValue" @close="Root.cancel">

  </madoka-mask>

</template>
<script setup lang="ts">
import MadokaMask from "@/components/MadokaMask.vue";

const modelValue = defineModel({
  default: false
})
const Root = (() => {
  const cancel = (e: Event) => {

  };
  const s = reactive({
    cancel
  })
  return s
})()
</script>
<style scoped>

</style>