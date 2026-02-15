<template>
  <view-home />
</template>
<script setup lang="ts">
import ViewHome from "@/views/view-home/Index.vue"
import useOnce from "@/components/useOnce.ts"
import screenTip from "@/components/project/tips/screenTip.tsx"
import useAudioPlayer from '@/hooks/useAudioPlayer.ts'
useOnce("screenTip", screenTip, 500)
useAudioPlayer().buildRandomList()
</script>

<style scoped></style>
