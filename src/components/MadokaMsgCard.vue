<template>
  <div class="card__wrapper">
    <div class="card">
      <div class="card__header">
        <div class="avatar">
          <img draggable="false" :src="avatarSrc" loading="lazy" alt="" />
        </div>
        <div class="user">
          <div class="name">{{ username }}</div>
        </div>
        <div style="margin-left: auto">#{{ externalId }}</div>
      </div>

      <div class="card__content">
        {{ content }}
      </div>

      <div class="card__footer">
        {{ dayjs(createTime).format("YYYY/MM/DD HH:mm:ss") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
import { getAvatarUrl } from "@/utils/resource.ts"

const props = withDefaults(
  defineProps<{
    content: string
    uid: number
    createTime: number
    username: string
    externalId: number
    origin?: "madokami" | "kami" | string
  }>(),
  {},
)

const avatarSrc = computed(() => (props.origin === "madokami" ? getAvatarUrl(props.uid) : `https://kami.im/getavatar.php?uid=${props.uid}`))
</script>

<style scoped>
.card__wrapper {
  padding: 20px 5px 5px;

  &:hover {
    .name {
      text-decoration: underline;
    }
  }
  .card {
    width: 370px;
    height: 500px;
    padding: 14px;
    overflow: auto;

    background: rgba(255, 255, 255, 0.35);
    backdrop-filter: blur(8px);
    border-radius: 14px;

    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    color: #333;

    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .card__header {
    display: flex;
    align-items: center;
    gap: 10px;

    .avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .user {
      .name {
        font-size: 14px;
        font-weight: 600;
      }

      .uid {
        font-size: 12px;
        opacity: 0.6;
      }
    }
  }

  .card__content {
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .card__footer {
    margin-top: auto;
    font-size: 12px;
    opacity: 0.6;
    text-align: right;
  }
}
</style>
