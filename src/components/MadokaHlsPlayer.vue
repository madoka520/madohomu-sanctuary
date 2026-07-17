<template>
  <video ref="videoRef" class="madoka-hls-player" autoplay></video>
</template>

<script setup lang="ts">
import Hls from 'hls.js'

const props = withDefaults(
  defineProps<{
    src?: string
  }>(),
  {},
)
const videoRef = useTemplateRef('videoRef')
const Player = (() => {
  let hlsInstance: Hls | null = null

  const f = {
    play: () => {
      const video = videoRef.value
      if (!video) return
      video.play().catch(() => {})
    },
    pause: () => {
      const video = videoRef.value
      if (!video) return
      video.pause()
    },
    destroy: () => {
      if (hlsInstance) {
        hlsInstance.destroy()
        hlsInstance = null
      }
    },
  }

  const initHls = (url: string) => {
    const video = videoRef.value
    if (!video) return

    f.destroy()

    if (Hls.isSupported()) {
      hlsInstance = new Hls()
      hlsInstance.loadSource(url)
      hlsInstance.attachMedia(video)
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        f.play()
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url
      video.addEventListener('loadedmetadata', () => {
        f.play()
      })
    }
  }

  const init = () => {}

  const initOnMounted = () => {
    if (props.src) {
      initHls(props.src)
    }
  }

  const s = reactive({
    ...f,
  })

  init()
  onMounted(initOnMounted)

  onUnmounted(() => {
    f.destroy()
  })

  return s
})()
</script>

<style scoped>
.madoka-hls-player {
  width: 100%;
  height: 100%;
}
</style>
