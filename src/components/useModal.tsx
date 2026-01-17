// modal.tsx
import { reactive, createVNode, render } from "vue"
import type { JSX } from "vue/jsx-runtime"
import MadokaDialog from "@/components/MadokaDialog.vue"
import { message } from "@/components/message.tsx"

type ConfirmOptions = {
  title?: string
  content?: JSX.Element
  onOk?: () => void
  onCancel?: () => void
}

export default (() => {
  const confirm = (options: ConfirmOptions) => {
    const state = reactive({
      visible: false, // ⚠️ 一定是 false
      title: options.title ?? "",
      content: options.content ?? null,
      onOk: options.onOk,
      onCancel: options.onCancel,
    })

    const container = document.createElement("div")
    document.body.appendChild(container)

    const close = () => {
      state.visible = false
      setTimeout(() => {
        render(null, container)
        container.remove()
      }, 300)
    }

    const vnode = createVNode(() => (
      <MadokaDialog
        v-model={state.visible}
        title={state.title}
        onOk={async (e) => {
          try {
            await state.onOk?.()
            close()
          } catch (error: any) {
            if (error.message) message.error(error.message)
          }
        }}
        onCancel={(e) => {
          state.onCancel?.()
          close()
        }}
      >
        {{ default: state.content }}
      </MadokaDialog>
    ))

    render(vnode, container)

    // ⚠️ 关键：等组件真正挂载后，再打开
    queueMicrotask(() => {
      state.visible = true
    })
  }

  return {
    confirm,
  }
})()
