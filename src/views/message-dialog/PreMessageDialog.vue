<template>
  <madoka-dialog
    v-model="Root.opened"
    title="发送留言"
    ok-text="发送"
    @ok="Root.ok"
  >
    <div
      class="madoka-input"
      contenteditable="true"
      v-if="Root.opened"
      ref="inputRef"
    >
      <div v-if="Root.isReply" class="reply" contenteditable="false">
        <header class="flex">
          <i class="mdi mdi-reply" style="font-size: 28px"></i>
          <div class="avatar">
            <img
              draggable="false"
              :src="Root.avatarSrc"
              loading="lazy"
              alt=""
            />
          </div>
          <div class="user">
            <div class="name">{{ Root.data.username }}</div>
          </div>
          <div class="uid" style="margin-left: auto">
            #{{ Root.data.externalId }}
          </div>
        </header>
        <div class="reply-content">&#x200B;{{ Root.data.content }}</div>
      </div>
    </div>
  </madoka-dialog>
</template>

<script setup lang="ts">
import MadokaDialog from '@/components/MadokaDialog.vue'
import MessageApi from '@/api/MessageApi.ts'
import axios from 'axios'
import { getAvatarUrl } from '@/utils/resource.ts'

const inputRef = useTemplateRef('inputRef')
const emits = defineEmits(['ok'])
type IParam = {
  messageId: number
  content: string
  uid: number
  updateTime: number
  origin: string
  externalId: number
  username: string
}
const Root = (() => {
  const open = () => {
    s.opened = true
  }
  const getPlainText = (root: HTMLElement) => {
    let result = ''

    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        result += node.nodeValue ?? ''
        return
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement

        const isBlock = el.tagName === 'DIV' || el.tagName === 'P'

        if (isBlock && result && !result.endsWith('\n')) {
          result += '\n'
        }

        if (el.tagName === 'BR') {
          result += '\n'
          return
        }

        const before = result.length
        el.childNodes.forEach(walk)

        if (isBlock && result.length !== before && !result.endsWith('\n')) {
          result += '\n'
        }
      }
    }

    root.childNodes.forEach(walk)

    return result.replace(/\n$/, '')
  }
  const getInputText = () => {
    const root = inputRef.value
    if (!root) return ''

    const clone = root.cloneNode(true) as HTMLElement

    // 把 reply 块删掉
    clone.querySelector('.reply')?.remove()

    return getPlainText(clone)
  }

  const getAvatar = async () => {
    if (s.data.origin === 'madohomu.love') {
      const res = await axios.get(
        'https://haojiezhe12345.top:82/madohomu/api/user/find',
        { params: { id: s.data.uid } },
      )
      return `https://haojiezhe12345.top:82/madohomu/api/data/images/avatars/${res.data[0]?.avatar ?? -1}`
    }
    return s.data.origin === 'madokami'
      ? `${getAvatarUrl(s.data.uid)}?t=${s.data.updateTime}`
      : `https://kami.im/getavatar.php?uid=${s.data.uid}`
  }

  const openReply = async (data: IParam) => {
    s.isReply = true
    s.opened = true
    s.data = data
    s.avatarSrc = await getAvatar()
  }

  const ok = async () => {
    const text = getInputText()
    const res = await MessageApi.send({
      pid: s.data.messageId,
      content: text,
    })
    s.opened = false
    emits('ok', res)
  }
  const s = reactive({
    opened: false,
    isReply: false,
    data: {} as IParam,
    avatarSrc: '',
    open,
    ok,
    openReply,
  })
  return s
})()

defineExpose({
  open: Root.open,
  openReply: Root.openReply,
})
</script>

<style scoped lang="less">
.madoka-input {
  // 基础边框与圆角
  border: 1px solid fade(#ffc0cb, 60%);
  border-radius: 12px;

  // 布局与尺寸
  width: 100%;
  min-height: 340px;
  padding: 12px;
  box-sizing: border-box;

  // 背景质感
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  color: white;
  font-size: 14px;
  line-height: 1.5;

  // 交互动画
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;

  &:focus {
    border-color: #ffc0cb;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 15px fade(#ffc0cb, 30%);
  }

  // 模拟 Placeholder (当内容为空时显示)
  &:empty::before {
    content: '说点什么吧...';
    color: rgba(255, 255, 255, 0.4);
    pointer-events: none;
  }

  .reply {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    background: rgba(0, 0, 0, 0.2);
    padding: 6px 12px 6px 6px;
    border-radius: 25px;
    margin-bottom: 10px;
    user-select: none;
    border: 1px solid rgba(255, 192, 203, 0.2);

    max-width: 400px;

    header {
      align-items: center;
      gap: 10px;
      width: 100%;

      .avatar {
        width: 32px !important; // 稍微缩小一点更精致
        height: 32px !important;
        border-radius: 50%;
        overflow: hidden;
        border: 1px solid rgba(255, 192, 203, 0.5);

        img {
          object-fit: cover;
          width: 100%;
          height: 100%;
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

    .reply-info {
      font-size: 12px;
      color: #ffc0cb;
      font-weight: bold;
      text-shadow: 0 0 5px rgba(255, 192, 203, 0.5);
    }
  }
}
</style>
