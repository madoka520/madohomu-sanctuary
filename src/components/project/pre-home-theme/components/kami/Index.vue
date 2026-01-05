<template>
  <div
    class="bg"
    :style="{
      background: `url(${getImgUrl(`kami/kami_${Root.current}.webp`)}) center / cover no-repeat`,
    }"
  ></div>
</template>

<script setup lang="ts">
import { getImgUrl } from "@/utils/resource.ts"

const Root = (() => {
  const s = reactive({
    current: 1,
    list: [
      {
        message: [
          "Darkness cannot drive out darkness",
          "only light can do that",
          "Hate cannot drive out hate",
          "only love can do that.",
          "Your sin , I bear",
        ],
      },
      {
        message: ["奇跡も", "魔法も", "あるんだよ", "後悔なんて、あるわけない"],
      },
      {
        message: ["don't forget", "always somewhere", "someone is fighting for you", "as long as you remember her", "You are not alone."],
      },
      {
        message: [
          "夢はこの部屋の中で",
          "優しい歌をずっと君に歌っていた",
          "何がほんとのことなの",
          "一番強く信じられる世界を追いかけて",
          "君の銀の庭へ",
        ],
      },
      {
        message: ["如果有人告诉我", "怀有希望是一件错误的事情", "我将无论多少次都会出言反驳", "不管何时我都能这样坚持。"],
      },
    ],
  })
  return s
})()
</script>

<style scoped>
.bg {
  width: 100%;
  height: 100%;
}
</style>