<template>
  <madoka-mask v-model="modelValue" >
    <div class="dialog__overlay" :style="{ width, height }" @click.stop ref="overlayRef">
      <header>
        <slot name="header">
          {{ title }}
        </slot>
      </header>
      <main>
        <slot />
      </main>
      <footer>
        <slot name="footer">
          <madoka-btn @click="Root.ok" :text="okText" variant="outlined" color="pink" />
          <madoka-btn @click="Root.cancel" :text="cancelText" variant="outlined" color="pink" />
        </slot>
      </footer>
    </div>
  </madoka-mask>
</template>
<script setup lang="ts">
import MadokaMask from "@/components/MadokaMask.vue";
import MadokaBtn from "@/components/button/Index.vue";

const props = withDefaults(
  defineProps<{
    width?: string;
    height?: string;
    footer?: boolean;
    title?: string;
    okText?: string
    cancelText?: string
  }>(),
  {
    title: "弹窗",
    footer: true,
    width: "400px",
    height: "300px",
    okText: "确 定",
    cancelText: "取 消"
  },
);

const overlayRef = useTemplateRef("overlayRef");

const mouse = useMouse();
const modelValue = defineModel({
  default: false,
});
const emits = defineEmits<{
  (e: "cancel", event: Event): void;
  (e: "ok", event: Event): void;
}>();

const Root = (() => {
  const setWatcher = () => {
    watch(modelValue, (visible) => {
      const el = overlayRef.value;
      if (!el) return;

      if (visible) {
        /* —— 打开 —— */
        nextTick(async () => {
          const { width: w, height: h } = el.getBoundingClientRect();
          const left = mouse.x.value - w * 5;
          const top = mouse.y.value - h * 5;

          s.lastX = left;
          s.lastY = top;
          /* 初始状态：在鼠标中心缩小、透明 */
          Object.assign(el.style, {
            left: left + "px",
            top: top + "px",
          });
          /* 下一帧触发过渡到居中放大 */
          requestAnimationFrame(() => el.classList.add("enter-active"));
        });
      } else {
        /* —— 关闭 —— */

        nextTick(() => {
          // 移除打开状态类
          el.classList.remove("enter-active");
          // 添加关闭状态类，触发淡出动画
          el.classList.add("leave-active");

          // 监听动画结束事件
          const onEnd = (e: TransitionEvent) => {
            if (e.target === el) {
              el.removeEventListener("transitionend", onEnd);
              el.classList.remove("leave-active");
              Object.assign(el.style, {
                // 还原初始内联样式
                left: "",
                top: "",
                transform: "",
                opacity: "",
              });
            }
          };
          el.addEventListener("transitionend", onEnd);
        })

      }
    });
  };

  const cancel = async (e: Event) => {
    modelValue.value = false
    emits("cancel", e);
  };
  const ok = async (e: Event) => {
    modelValue.value = false;
    emits("ok", e);
  };
  const s = reactive({
    lastX: 0,
    lastY: 0,
    ok,
    cancel,
  });
  setWatcher();
  return s;
})();
</script>
<style lang="less" scoped>
.dialog__overlay {
  display: flex;
  flex-direction: column;
  position: fixed;
  transform: scale(0.1);
  border-radius: 5px;
  background: white;
  overflow: hidden;
  opacity: 0;
  header {
    padding: 20px;
  }

  main {
    flex: 1;
    overflow: auto; // 如果内容过多，可以滚动
    padding: 0 20px;
  }

  footer {
    display: flex;
    justify-content: end;
    padding: 20px;
    gap: 10px;
  }
}

.dialog__overlay.enter-active {
  left: 50% !important;
  top: 50% !important;
  transform: translate(-50%, -50%) scale(1) !important;
  opacity: 1 !important;
  transition: all 0.3s cubic-bezier(0.1, 1, 0.4, 1);
}

.dialog__overlay.leave-active {
  opacity: 0 !important;
  transition: all 0.3s cubic-bezier(0.1, 1, 0.4, 1);
}

</style>
