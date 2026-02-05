<template>
  <div class="card__wrapper">
    <div class="flex card" :style="cardStyle" :data-time="createTime">
      <div class="flex card__header">
        <div class="avatar">
          <img draggable="false" :src="avatarSrc" loading="lazy" alt="" />
        </div>
        <div class="user">
          <div class="name">{{ username }}</div>
        </div>
        <div class="uid" style="margin-left: auto">#{{ externalId }}</div>
      </div>

      <div class="card__content">
        {{ content }}
        <div v-if="image">
          <madoka-img :src="`https://haojiezhe12345.top:82/madohomu/api/data/images/posts/${image}.jpg`" />
        </div>
      </div>

      <footer>
        <div class="card__bar">
          <span>
            <i class="mdi mdi-heart liked" v-if="+liked" @click="Root.like" />
            <i class="mdi mdi-heart-outline" v-else @click="Root.like" />
            <span class="number" v-show="likes !== 0">
              {{ likes }}
            </span>
          </span>
          <span>
            <i class="mdi mdi-reply"></i>
          </span>
        </div>
        <div class="flex card__operate">
          <span v-if="origin !== 'madokami'">
            <a v-if="origin === 'kami'" href="https://kami.im" target="_blank">kami.im</a>
            <a v-else :href="`https://${origin}`" target="_blank">
              {{ origin }}
            </a>
          </span>
          <div class="flex" style="margin-left: auto">
            {{ dayjs(createTime).format('YYYY/MM/DD HH:mm:ss') }}
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { getAssetUrl, getAvatarUrl, getImgUrl } from '@/utils/resource.ts'
import { computed } from 'vue'
import axios from 'axios'
import MadokaImg from '@/components/MadokaImg.vue'
import messageApi from '@/api/MessageApi.ts'
import PreMessageDialog from '@/views/message-dialog/PreMessageDialog.vue'

const props = withDefaults(
  defineProps<{
    messageId: number
    content: string
    uid: number
    createTime: number
    username: string
    externalId: number
    updateTime: number
    origin?: 'madokami' | 'kami' | string
    avatar?: string
    image?: string
    likes: number
    liked: number
  }>(),
  {},
)
const emits = defineEmits(['like'])
const avatarSrc = computedAsync(async () => {
  if (props.origin === 'madohomu.love') {
    const res = await axios.get('https://haojiezhe12345.top:82/madohomu/api/user/find', { params: { id: props.uid } })
    return `https://haojiezhe12345.top:82/madohomu/api/data/images/avatars/${res.data[0]?.avatar ?? -1}`
  }
  return props.origin === 'madokami' ? `${getAvatarUrl(props.uid)}?t=${props.updateTime}` : `https://kami.im/getavatar.php?uid=${props.uid}`
})

const cardStyle = computed(() => {
  // 使用 externalId 取模，确保同一个 ID 的卡片背景永远固定
  const fixedNum = (props.externalId % 22) + 1
  const bgUrl = getAssetUrl(`madokami/msg_bg/bg_${fixedNum}`)
  return {
    '--bg-image': `url(${bgUrl}.webp)`,
  }
})

const Root = (() => {
  /**
   * 发送请求 改变该条留言的喜爱状态
   */
  const like = async () => {
    await messageApi.like(props.messageId)
    emits('like')
  }
  const s = reactive({
    like,
  })
  return s
})()
</script>

<style scoped lang="less">
.card__wrapper {
  padding: 20px 5px 5px;
  opacity: 0.7;

  &:hover {
    opacity: 1;

    .name {
      text-decoration: underline;
    }

    .card::before {
      // 悬浮时触发毛玻璃效果
      filter: blur(8px) brightness(0.8);
    }
  }
  .card {
    width: 22vw;
    height: 55vh;
    padding: 14px;
    overflow: auto;
    position: relative; // 必须是 relative 才能让伪元素定位
    isolation: isolate; // 确保内容层级在伪元素之上

    background: rgba(255, 255, 255, 0.35);
    backdrop-filter: blur(8px);
    border-radius: 26px;
    corner-shape: superellipse(1.333);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    color: white;

    flex-direction: column;
    gap: 12px;
    // 使用伪元素处理背景，这样 blur 滤镜才不会影响到文字
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;

      // 叠加线性渐变和动态背景
      background-image: linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), var(--bg-image);

      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;

      // 过渡动画
      transition:
        filter 0.3s ease,
        transform 0.3s ease;
    }
  }

  .card__header {
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

  footer {
    margin-top: auto;
    display: flex;
    flex-direction: column;
  }

  .card__bar {
    font-size: 20px;
    margin-left: auto;
    & > span {
      display: inline-flex;
      width: 35px;
      height: 35px;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      &:hover {
        background: gray;
      }
    }
    .liked {
      color: red;
    }
  }

  .card__operate {
    font-size: 12px;
    opacity: 0.6;
    width: 100%;

    a {
      // 基础样式重置
      text-decoration: none;
      color: white;
      font-weight: 500;
      position: relative;
      transition: color 0.3s ease;
      padding: 4px 0;

      // 使用伪元素制作下划线动画
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background-color: white;
        transition: width 0.3s ease-in-out;
      }

      // 悬浮状态
      &:hover {
        color: white;

        &::after {
          width: 100%;
        }
      }

      // 点击后的反馈
      &:active {
        opacity: 0.7;
      }
    }
  }
}
</style>
