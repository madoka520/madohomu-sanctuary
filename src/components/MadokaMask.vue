<template>
  <teleport to="body">
    <div class="mask" v-show="modelValue" @click="Root.cancel">
      <slot/>
    </div>
  </teleport>

</template>
<script setup lang="ts">

const modelValue = defineModel({
  default: false
})
const emits = defineEmits<{
  (e: "cancel", event: Event): void
}>()
const Root = (() => {
  const cancel = (e:Event) => {
    modelValue.value = false
    emits('cancel', e)
  };
  const s = reactive({
    cancel
  })
  return s
})()
</script>
<style scoped>
.mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999999;
}
</style>