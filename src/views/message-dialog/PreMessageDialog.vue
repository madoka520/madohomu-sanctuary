<template>
  <madoka-dialog
    v-model="Root.opened"
    :radius="12"
    :title="$t('msgDialog.title')"
    :ok-text="$t('common.send')"
    :cancel-text="$t('common.cancel')"
    @ok="Root.ok"
  >
    <div v-if="Root.opened" class="input-wrap">
      <div class="madoka-input" contenteditable="true" v-if="Root.opened" ref="inputRef" :data-placeholder="$t('msgDialog.placeholder')">
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
        <!-- =========start========== 引用预览把表情标记还原成图（原插值会露出 [B_M_12] 原文） -->
        <div class="reply-content">
          &#x200B;<template
            v-for="(part, i) in splitStickerText(Root.data.content)"
            :key="i"
          >
            <span v-if="part.type === 'text'">{{ part.value }}</span>
            <img
              v-else
              class="sticker"
              :src="part.url"
              :alt="`[${part.value}]`"
              draggable="false"
            />
          </template>
        </div>
        <!-- 原代码 - Codex 保留
        <div class="reply-content">&#x200B;{{ Root.data.content }}</div>
        -->
      </div>
      </div>
      <!-- =========start========== 表情按钮：输入框右下角，聊天式（mdi-sticker-emoji 只有实心版，字体里没有 outline 变体） -->
      <button
        ref="stickerToggleRef"
        class="sticker-toggle"
        :class="{ 'is-active': Root.pickerOpened }"
        :title="$t('msgDialog.sticker')"
        @mousedown.prevent
        @click="Root.pickerOpened = !Root.pickerOpened"
      >
        <i class="mdi mdi-sticker-emoji" />
      </button>
      <!-- ========end======== -->
      <!-- =========start========== 表情气泡弹窗：绝对定位锚在按钮上方，带指向尾巴，不占布局空间 -->
      <div v-if="Root.pickerOpened" ref="stickerPanelRef" class="sticker-panel">
        <div class="sticker-tabs">
          <button
            v-for="g in STICKER_GROUPS"
            :key="g.key"
            class="sticker-tab"
            :class="{ 'is-active': Root.activeGroup === g.key }"
            @mousedown.prevent
            @click="Root.activeGroup = g.key"
          >
            {{ $t('stickers.' + g.label) }}
          </button>
        </div>
        <div class="sticker-grid">
          <button
            v-for="item in Root.activeItems"
            :key="item"
            class="sticker-item"
            :title="Root.stickerTitle(item)"
            :style="{ backgroundImage: `url(${stickerUrl(item.replace(/\.\w+$/, ''))})` }"
            @mousedown.prevent
            @click="Root.insertSticker(item)"
          />
        </div>
      </div>
      <!-- ========end======== -->
    </div>
  </madoka-dialog>
</template>

<script setup lang="ts">
import { MadokaDialog } from '@madoka520/vue-ui'
import MessageApi from '@/api/MessageApi.ts'
// =========start========== 系统预设表情包
import { STICKER_GROUPS, stickerUrl, splitStickerText, type StickerGroupKey } from '@/utils/stickers.ts'
// =========start========== i18n：表情分组悬浮提示文案
import i18n from '@/i18n'
// ========end========
// ========end========

const inputRef = useTemplateRef('inputRef')
const emits = defineEmits(['ok'])
type IParam = {
  id: number
  content: string
  externalId: number
  username: string
  avatar: string
  replies: IParam[]
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

        // =========start========== 表情包节点 → [A_1] 标记（存纯文本，展示端还原为图片）
        if (el.tagName === 'IMG' && el.classList.contains('sticker')) {
          result += `[${el.dataset.s ?? ''}]`
          return
        }
        // ========end========

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

  const openReply = async (data: IParam) => {
    s.data = data
    s.avatarSrc = data.avatar
    s.isReply = true
    s.opened = true
  }

  // =========start========== ===== 表情包插入 =====
  const activeItems = computed(() =>
    STICKER_GROUPS.find((g) => g.key === s.activeGroup)?.items ?? [],
  )

  // 悬浮提示用「分组名 + 序号」，不暴露 B_M_12 这类文件名；分组名走 i18n
  const stickerTitle = (file: string) => {
    const labelKey = STICKER_GROUPS.find((g) => g.key === s.activeGroup)?.label ?? ''
    const no = file.replace(/\.\w+$/, '').split('_').pop()
    return `${i18n.global.t(`stickers.${labelKey}`)} ${no}`
  }

  // 面板按钮 @mousedown.prevent 保住了输入框焦点/选区，可直接在光标处插入
  const insertSticker = (file: string) => {
    const root = inputRef.value
    if (!root) return
    const name = file.replace(/\.\w+$/, '')
    const img = document.createElement('img')
    img.className = 'sticker'
    img.contentEditable = 'false'
    img.draggable = false
    img.dataset.s = name
    img.src = stickerUrl(name)
    img.alt = `[${name}]`
    // 内联尺寸兜底：手动创建的 DOM 不带 scoped 属性，以防 :deep 规则未命中
    // 宽度取父容器（输入框）的 20%，高度按原图比例自适应
    img.style.width = '20%'
    img.style.height = 'auto'
    img.style.verticalAlign = 'middle'
    img.style.margin = '0 2px'

    const sel = window.getSelection()
    let range: Range | null =
      sel && sel.rangeCount > 0 && root.contains(sel.anchorNode)
        ? sel.getRangeAt(0)
        : null

    // 先聚焦再恢复选区：输入框此前没焦点时，focus 会重置光标
    root.focus()

    if (range) {
      range.deleteContents()
      range.insertNode(img)
      // 尾随零宽空格：保证表情后面还能继续输入文字
      if (!img.nextSibling) img.after(document.createTextNode('\u200B'))
      range.setStartAfter(img)
    } else {
      root.appendChild(img)
      root.appendChild(document.createTextNode('\u200B'))
      range = document.createRange()
      range.setStartAfter(root.lastChild!)
    }
    range.collapse(true)
    sel?.removeAllRanges()
    sel?.addRange(range)
  }
  // ========end========

  const ok = async () => {
    const text = getInputText()
    const res = (await MessageApi.send({
      pid: s.data.id,
      content: text,
    })) as any
    s.opened = false
    res.pid && s.data.replies.push(res)
    console.log(234)
    emits('ok', res)
  }
  const s = reactive({
    opened: false,
    isReply: false,
    data: {} as IParam,
    avatarSrc: '',
    // =========start========== 表情包选择器状态（默认展示第一组「鹿目圆」）
    pickerOpened: false,
    activeGroup: 'B_M' as StickerGroupKey,
    activeItems,
    stickerTitle,
    insertSticker,
    // ========end========
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

// =========start========== 点击气泡外任意处关闭（按钮本身忽略，避免关了又开）
const stickerToggleRef = useTemplateRef('stickerToggleRef')
const stickerPanelRef = useTemplateRef('stickerPanelRef')
onClickOutside(
  stickerPanelRef,
  () => {
    Root.pickerOpened = false
  },
  { ignore: [stickerToggleRef] },
)
// 弹窗关闭时收起气泡，避免下次打开还挂着
watch(
  () => Root.opened,
  (opened) => {
    if (!opened) Root.pickerOpened = false
  },
)
// ========end========
</script>

<style scoped lang="less">
// =========start========== ===== 表情包选择器 =====
// 布局：面板在输入框上方，按钮在输入框右下角，三者同宽（clamp 一致）整体居中
@pink-primary: #ffb7c5;
@pink-dark: #ff85a2;
@rose-sub: rgba(102, 90, 92, 0.65);

.input-wrap {
  position: relative;
  width: clamp(300px, 20vw, 600px);
  margin: 0 auto;

  // 覆盖 .madoka-input 的固定宽度，跟随包裹层
  .madoka-input {
    width: 100%;
  }
}

.sticker-toggle {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffb7c5, #ff8fab);
  box-shadow: 0 3px 12px rgba(255, 133, 162, 0.45);
  transition: all 0.25s ease;

  .mdi {
    font-size: 23px;
    color: #fff;
  }

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 16px rgba(255, 133, 162, 0.6);
  }

  &.is-active {
    background: linear-gradient(135deg, #ff8fab, #ff6b95);
  }
}

.sticker-panel {
  // 气泡弹窗：锚在右下角表情按钮正上方，悬浮于输入框之上
  position: absolute;
  right: 12px; // 与按钮 right 对齐
  bottom: 62px; // 按钮(40) + 底距(12) + 间隙(10)
  z-index: 2;
  width: clamp(280px, 24vw, 380px);
  border: 1px solid rgba(255, 183, 197, 0.4);
  background: rgba(255, 248, 250, 0.96);
  box-shadow: 0 10px 28px rgba(255, 133, 162, 0.28);
  transform-origin: bottom right;
  animation: sticker-pop 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);

  // 指向按钮的小尾巴：clip-path 纯三角（旋转方块会在顶端露出直角、还会被底边线穿过）
  // 高度 7px、bottom -6px：顶部 1px 压进面板内部，正好盖住底边框接缝
  &::after {
    content: '';
    position: absolute;
    right: 26px; // 对准按钮中心（按钮中心距右 32px，尾巴宽 12px）
    bottom: -6px;
    width: 12px;
    height: 7px;
    background: rgba(255, 248, 250, 0.96);
    clip-path: polygon(0 0, 100% 0, 50% 100%);
  }

  .sticker-tabs {
    display: flex;
    gap: 6px;
    padding: 8px 8px 0;
  }

  .sticker-tab {
    padding: 4px 10px;
    font-size: 12px;
    color: @rose-sub;
    background: transparent;
    border: 1px solid rgba(255, 183, 197, 0.35);
    transition: all 0.25s ease;

    &:hover {
      color: @pink-dark;
    }

    &.is-active {
      color: @pink-dark;
      border-color: rgba(255, 133, 162, 0.75);
      background: rgba(255, 240, 245, 0.5);
    }
  }

  .sticker-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(52px, 1fr));
    gap: 6px;
    max-height: 220px;
    padding: 8px;
    overflow-y: auto;
  }

  .sticker-item {
    aspect-ratio: 1;
    background-color: transparent;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    border: 1px solid transparent;
    transition: all 0.2s ease;

    &:hover {
      border-color: rgba(255, 133, 162, 0.6);
      background-color: rgba(255, 255, 255, 0.5);
      transform: scale(1.08);
    }
  }
}

@keyframes sticker-pop {
  from {
    opacity: 0;
    transform: scale(0.86) translateY(8px);
  }
}
// ========end========

.madoka-input {
  // 基础边框与圆角
  border: 1px solid fade(#ffc0cb, 60%);
  border-radius: 12px;

  // 布局与尺寸
  width: clamp(300px, 20vw, 600px);
  min-height: 340px;
  padding: 12px;
  box-sizing: border-box;

  // 背景质感
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  color: white;
  font-size: 14px;
  line-height: 1.5;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);

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
    content: attr(data-placeholder);
    color: rgba(255, 255, 255, 1);
    pointer-events: none;
  }

  // =========start========== 引用预览里的行内表情（固定小尺寸；插入输入框的表情尺寸在 JS 里内联为父容器 20%）
  :deep(img.sticker) {
    display: inline-block;
    width: 32px;
    height: 32px;
    max-width: 100%;
    object-fit: contain;
    margin: 0 2px;
    vertical-align: middle;
  }
  // ========end========

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
