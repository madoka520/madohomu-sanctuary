<template>
  <audio
    :src="audioPlayer.currentUrl"
    autoplay
    :ref="audioPlayer.ref.set"
    @play="onPlay"
    @ended="audioPlayer.next"
    type="audio/webm; codecs=opus"
  ></audio>
</template>
<script setup lang="ts">
import useAudioPlayer from '@/hooks/useAudioPlayer.ts'
const audioPlayer = useAudioPlayer()
const play = () => {
  removeEventListener('click', play)
  if (!audioPlayer.playing) {
    audioPlayer.play()
  }
}
addEventListener('click', play)
const onPlay = () => {
  audioPlayer.playing = true
}
onMounted(() => {
  if (!('mediaSession' in navigator)) return

  navigator.mediaSession.setActionHandler('play', () => {
    audioPlayer.play()
  })

  navigator.mediaSession.setActionHandler('pause', () => {
    audioPlayer.pause?.()
  })

  navigator.mediaSession.setActionHandler('nexttrack', () => {
    audioPlayer.next()
  })

  navigator.mediaSession.setActionHandler('previoustrack', () => {
    audioPlayer.prev()
  })
})

watch(
  () => audioPlayer.playing,
  (playing) => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = playing ? 'playing' : 'paused'
    }
  },
)
const isEditing = (e: KeyboardEvent) => {
  const t = e.target as HTMLElement | null
  if (!t) return false

  return (
    t.isContentEditable || t.tagName === 'INPUT' || t.tagName === 'TEXTAREA'
  )
}

addEventListener('keydown', (e) => {
  if (isEditing(e)) return
  switch (e.code) {
    case 'Space': {
      if (audioPlayer.playing) {
        audioPlayer.pause()
        break
      }
      audioPlayer.resume()
      break
    }
    case 'ArrowRight': {
      audioPlayer.next()
      break
    }
    case 'ArrowLeft': {
      audioPlayer.prev()
    }
  }
})
</script>
<style scoped></style>
