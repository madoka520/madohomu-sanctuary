// v-load-when-visible.ts
import { useIntersectionObserver } from '@vueuse/core'

export default {
  mounted: (el: Element, binding: { value: () => void | Promise<void> }) => {
    let loaded = false

    const { stop } = useIntersectionObserver(el, ([entry]) => {
      if (loaded) return
      if (!entry.isIntersecting) return

      loaded = true
      binding.value?.()
      stop()
    })

    ;(el as any).__vLoadWhenVisibleStop__ = stop
  },

  unmounted: (el: Element) => {
    ;(el as any).__vLoadWhenVisibleStop__?.()
  },
}
