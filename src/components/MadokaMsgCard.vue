<template>
  <div class="card__wrapper">
    <div class="flex card" :style="cardStyle" :data-time="message.createTime">
      <component
        :is="Root.buildHeader(avatarSrc, message.username, message.externalId)"
      />
      <div class="card__content">
        <div class="main-text">{{ message.content }}</div>

        <div v-if="message.image" class="image-gallery">
          <madoka-img
            v-for="item in message.image.split(',')"
            :key="item"
            :src="`https://haojiezhe12345.top:82/madohomu/api/data/images/posts/${item}.jpg`"
          />
        </div>

        <div v-if="!isEmpty(message.replies)" class="replies-container">
          <component :is="Root.buildReplies(message.replies)" />
        </div>
      </div>

      <component
        :is="Root.buildFooter(message, avatarSrc)"
        :key="message.liked"
      />
    </div>
  </div>
</template>
<script setup lang="tsx">
import dayjs from 'dayjs'
import { getAssetUrl, getAvatarUrl } from '@/utils/resource.ts'
import { computed } from 'vue'
import axios from 'axios'
import MadokaImg from '@/components/MadokaImg.vue'
import messageApi from '@/api/MessageApi.ts'
import { isEmpty } from 'lodash-unified'
import type { Message, origin } from '@/types/Message.ts'
import useCache from '@/hooks/useCache.ts'

const props = withDefaults(
  defineProps<{
    message: Message
  }>(),
  {},
)
const emits = defineEmits(['like', 'handleReply'])

const getAvatarSrc = async (
  origin: origin,
  uid: number,
  updateTime: number,
) => {
  if (origin === 'madohomu.love') {
    if (uid === -1) return

    const avatar =
      useCache().madohomuUserAvatar[uid] ??
      (
        await axios.get(
          'https://haojiezhe12345.top:82/madohomu/api/user/find',
          {
            params: { id: uid },
          },
        )
      ).data[0]?.avatar
    if (!avatar) {
      return
    }
    useCache().madohomuUserAvatar[uid] = avatar
    return `https://haojiezhe12345.top:82/madohomu/api/data/images/avatars/${avatar}`
  }
  return origin === 'madokami'
    ? `${getAvatarUrl(uid)}?t=${updateTime}`
    : `https://kami.im/getavatar.php?uid=${uid}`
}

const avatarSrc = computedAsync(
  async () =>
    await getAvatarSrc(
      props.message.origin,
      props.message.userId,
      props.message.userUpdateTime,
    ),
)

const cardStyle = computed(() => {
  // 使用 externalId 取模，确保同一个 ID 的卡片背景永远固定
  const fixedNum = (props.message.externalId % 22) + 1
  const bgUrl = getAssetUrl(`madokami/msg_bg/bg_${fixedNum}`)
  return {
    '--bg-image': `url(${bgUrl}.webp)`,
  }
})

const Root = (() => {
  /**
   * 构建留言头
   * @param src
   * @param username
   * @param id
   */
  const buildHeader = (src: any, username: string, id?: number) => (
    <header class="flex card__header">
      <div class="avatar">
        <img draggable="false" src={src} loading="lazy" alt="" />
      </div>
      <div class="user">
        <div class="name">{username}</div>
      </div>
      {id && (
        <div class="id" style="margin-left: auto">
          #{id}
        </div>
      )}
    </header>
  )

  const buildFooter = (obj: Message, avatarSrc: string) => {
    const { id, likes, liked, origin, createTime } = obj
    return (
      <footer>
        <div class="card__bar">
          <span>
            <i
              class={['mdi', liked ? 'mdi-heart liked' : 'mdi-heart-outline']}
              onClick={() => like(id, obj)}
            />

            {likes !== 0 && <span class="number">{likes}</span>}
          </span>
          {origin?.includes('madokami') && (
            <span>
              <i
                class="mdi mdi-reply"
                onClick={() => handleReply(obj, avatarSrc)}
              ></i>
            </span>
          )}
        </div>
        <div class="flex card__operate">
          {origin !== 'madokami' && (
            <span>
              <a href={`https://${origin}`} target="_blank">
                {origin}
              </a>
            </span>
          )}
          <div class="flex" style="margin-left: auto">
            {dayjs(createTime).format('YYYY/MM/DD HH:mm:ss')}
          </div>
        </div>
      </footer>
    )
  }

  const buildReplies = (replies: Message[] = []) => {
    return (
      <div>
        {replies.map((reply) => {
          getAvatarSrc('madokami', reply.userId, reply.userUpdateTime).then(
            (src) => (s.repliesAvatar[reply.userId] = src),
          )
          return (
            <>
              {buildHeader(
                s.repliesAvatar[reply.userId],
                reply.username,
                undefined,
              )}
              <div>
                {reply.content}
                <div class="replies-container">
                  {!isEmpty(reply.replies) && buildReplies(reply.replies)}
                </div>
              </div>
              {buildFooter(reply, s.repliesAvatar[reply.userId])}
            </>
          )
        })}
      </div>
    )
  }

  const handleReply = (obj, avatarSrc: string) => {
    emits('handleReply', {
      ...obj,
      avatar: avatarSrc,
    })
  }

  /**
   * 发送请求 改变该条留言的喜爱状态
   * 由于未知原因 如果是最外层的留言 需要emit到父组件修改数据才能响应式 回复则不需要
   */
  const like = async (messageId: number, obj: Message) => {
    await messageApi.like(messageId)
    if (!obj.pid) {
      emits('like', obj.liked)
      return
    }
    obj.liked = +!obj.liked
    const add = !!obj.liked ? 1 : -1
    obj.likes += add
  }
  const s = reactive({
    repliesAvatar: {},
    like,
    handleReply,
    buildHeader,
    buildReplies,
    buildFooter,
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
    border-radius: 18px;
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
      background-image:
        linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)),
        var(--bg-image);

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
      width: 3rem;
      height: 3rem;
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

      .id {
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

    .image-gallery {
      display: flex;
      gap: 12px;
    }
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
  // 重点：回复列表的层次感设计
  .replies-container {
    margin-top: 16px;
    padding-left: 12px;
    border-left: 2px solid rgba(255, 255, 255, 0.2); // 左侧装饰线
    display: flex;
    flex-direction: column;
    gap: 16px; // 每一条回复之间的间距

    :deep(header) {
      margin-top: 8px;
      transform: scale(0.9); // 让回复者的头像稍小一点
      transform-origin: left center;
      opacity: 0.9;
    }

    :deep(div) {
      // 针对 buildReplies 渲染出来的文字内容
      font-size: 13px;
      color: rgba(255, 255, 255, 0.85);
    }

    :deep(footer) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1); // 回复间的分割线
      padding-bottom: 8px;

      .card__bar {
        font-size: 16px; // 回复的互动按钮小一点
      }
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
