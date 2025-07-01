<template>
  <madoka-mask v-model="modelValue" @close="Root.cancel">
    <div class="dialog__container">

    </div>
    <slot/>
    <slot name="footer">
      <button>确定</button>
      <button>取消</button>
    </slot>
  </madoka-mask>

</template>
<script setup lang="ts">
import MadokaMask from "@/components/MadokaMask.vue";
const props = withDefaults(
  defineProps<{
    width?: string
    height?: string
    footer?: boolean
  }>(),
  {
    footer: true
  }
)
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
.dialog__container {
  width: v-bind(width);
  height: v-bind(height);
}
</style>