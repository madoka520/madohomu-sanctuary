<template>
  <div class="avatar-wrapper" :class="{ upload: uploadadble }">
    <img class="avatar" :src="`${getAvatarUrl(userId)}?t=${avatarUpdateTime}`" alt="" @error="onAvatarError" :style />
  </div>
</template>
<script setup lang="ts">
import { getAvatarUrl } from "@/utils/resource.ts"
import useToken from "@/hooks/useToken.ts"
const props = withDefaults(
  defineProps<{
    width?: number
    avatarUpdateTime?: number
    uploadadble?: boolean
  }>(),
  {
    avatarUpdateTime: 0,
    uploadadble: false,
  },
)
const tokenHook = useToken()
const userId = computed(() => tokenHook.userInfo.id)

const onAvatarError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = getAvatarUrl("default")
}
const style = computed(() => ({
  width: `${props.width}px`,
}))
</script>

<style scoped>
.avatar-wrapper {
  position: relative;

  user-select:none;
  .avatar {
    border-radius: 50%;
    border: 3px solid #fff;
    object-fit: cover;
    display: block;
  }
}
.upload {
  &::before {
    content: "上传头像";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
    font-size: 14px;
  }

  &:hover::before {
    opacity: 1;
  }
}
</style>
