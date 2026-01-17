// MadokaMessage.tsx
import { h, render, ref, type Ref } from "vue"

// 类型定义
type MessageType = "success" | "info" | "error" | "warn"

interface MessageOptions {
  text: string
  type?: MessageType
  duration?: number
}

// 存放当前消息节点
const messages: HTMLElement[] = []

const icons: Record<MessageType, string> = {
  success: "mdi-check-circle",
  info: "mdi-information",
  error: "mdi-alert-circle",
  warn: "mdi-alert",
}

// 核心创建消息函数
const createMessage = (options: MessageOptions) => {
  const { text, type = "info", duration = 2000 } = options
  const container = document.createElement("div")
  container.style.position = "fixed"
  container.style.top = "20px"
  container.style.left = "50%"
  container.style.transform = "translateX(-50%)"
  container.style.zIndex = "999999999"
  document.body.appendChild(container)

  const visible: Ref<boolean> = ref(true)

  const vnode = (
    <div
      class={`madoka-message ${type}`}
      style={{
        opacity: visible.value ? 1 : 0,
        transition: "all 0.3s",
        marginTop: messages.length * 60 + "px",
        display: "flex",
        alignItems: "center",
        padding: "10px 16px",
        borderRadius: "8px",
        color: "#fff",
        fontWeight: 500,
        backgroundColor: type === "success" ? "#ffb6c1" : type === "error" ? "#ff6961" : type === "info" ? "#87cefa" : "#ffa500",
      }}
    >
      <i class={`mdi ${icons[type]}`} style={{ marginRight: "8px" }}></i>
      <span>{text}</span>
    </div>
  )

  render(vnode, container)
  messages.push(container)

  setTimeout(() => {
    visible.value = false
    render(null, container)
    container.remove()
    messages.splice(messages.indexOf(container), 1)
  }, duration)
}

// 全局方法封装
export const message = {
  success: (text: string, duration?: number) => createMessage({ text, type: "success", duration }),
  info: (text: string, duration?: number) => createMessage({ text, type: "info", duration }),
  error: (text: string, duration?: number) => createMessage({ text, type: "error", duration }),
  warn: (text: string, duration?: number) => createMessage({ text, type: "warn", duration }),
}
