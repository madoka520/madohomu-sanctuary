<template>
  <teleport to="body">
    <div class="mask" v-show="modelValue" @click="Root.close">
    </div>
  </teleport>

</template>
<script setup lang="ts">

const modelValue = defineModel({
  default: false
})
const emits = defineEmits<{
  (e: "close", event: Event): void
}>()
const Root = (() => {
  const close = (e:Event) => {
    modelValue.value = false
    emits('close', e)
  };
  const s = reactive({
    close
  })
  return s
})()
</script>
<style scoped>
.mask {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999999;
}
</style>