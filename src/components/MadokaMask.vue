<template>
  <teleport to="body">
    <div>
      <Transition name="fade">
        <div class="mask" v-show="modelValue" @click="Root.cancel">
        </div>
      </Transition>
      <div class="content">
        <slot />
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    maskClosable?: boolean
    beforeClose?: () => void | Promise<void>
  }>(),
  {
    maskClosable: true
  }
)

const modelValue = defineModel({
  default: false
})

const emits = defineEmits<{
  (e: "cancel", event: Event): void
}>()

const Root = (() => {
  const cancel = async (e: Event) => {
    if (!props.maskClosable) return
    if (props.beforeClose) {
      //这个await去掉会导致弹窗关闭的时候突然跑到左下角
      await props.beforeClose()
    }
    emits('cancel', e)
    modelValue.value = false
  }
  return reactive({ cancel })
})()
</script>

<style scoped>
.mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999999;
}

/* 💫 下面是淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.content {
  z-index: 1000000;
  position: fixed;
}
</style>
