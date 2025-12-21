<template>
  <div ref="wrapper" style="display: flex; align-items: center;">
    <slot />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  color?: string
}>()

const rippleColor = props.color || 'rgba(0, 0, 0, 0.15)'
const wrapper = useTemplateRef("wrapper")

let isPressed = false
let overlay: HTMLDivElement | null = null

function createRipple(event: MouseEvent) {
  if (!wrapper.value) return

  const rect = wrapper.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const maxX = Math.max(x, rect.width - x)
  const maxY = Math.max(y, rect.height - y)
  const radius = Math.sqrt(maxX * maxX + maxY * maxY)
  const size = radius * 2

  isPressed = true

  const ripple = document.createElement('span')
  ripple.style.position = 'absolute'
  ripple.style.borderRadius = '50%'
  ripple.style.pointerEvents = 'none'
  ripple.style.width = ripple.style.height = `${size}px`
  ripple.style.left = `${x - size / 2}px`
  ripple.style.top = `${y - size / 2}px`
  ripple.style.backgroundColor = rippleColor
  ripple.style.transform = 'scale(0)'
  ripple.style.opacity = '0.3'
  ripple.style.transition = 'transform 0.6s ease, opacity 0.6s ease'

  wrapper.value.appendChild(ripple)

  requestAnimationFrame(() => {
    ripple.style.transform = 'scale(1)'
    ripple.style.opacity = '0'
  })

  ripple.addEventListener('transitionend', () => {
    ripple.remove()
  })

  // 按住显示半透明遮罩层
  setTimeout(() => {
    if (isPressed) {
      if (overlay) overlay.remove()
      overlay = document.createElement('div')
      overlay.style.position = 'absolute'
      overlay.style.top = '0'
      overlay.style.left = '0'
      overlay.style.right = '0'
      overlay.style.bottom = '0'
      overlay.style.backgroundColor = rippleColor
      overlay.style.opacity = '0.15'
      overlay.style.pointerEvents = 'none'
      overlay.style.transition = 'opacity 0.3s ease'
      wrapper.value?.appendChild(overlay)
    }
  }, 150)
}

function onMouseUp() {
  isPressed = false
  if (overlay) {
    overlay.style.opacity = '0'
    overlay.addEventListener(
      'transitionend',
      () => {
        overlay?.remove()
        overlay = null
      },
      { once: true }
    )
  }
}

onMounted(() => {
  if (wrapper.value) {
    if (getComputedStyle(wrapper.value).position === 'static') {
      wrapper.value.style.position = 'relative'
    }
    wrapper.value.style.overflow = 'hidden'
    wrapper.value.addEventListener('mousedown', createRipple)
  }
  window.addEventListener('mouseup', onMouseUp)
})

onBeforeUnmount(() => {
  if (wrapper.value) {
    wrapper.value.removeEventListener('mousedown', createRipple)
  }
  window.removeEventListener('mouseup', onMouseUp)
})
</script>



<style>
/* 你可以自己加点样式哦 */
</style>
