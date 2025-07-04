<template>
  <madoka-mask v-model="modelValue" @cancel="Root.cancel">
    <div class="dialog__overlay flex-center" :style="{ width, height }" @click.stop>
      <header>
        {{ title }}
      </header>
      <main>
        <slot />
      </main>
      <footer>
        <div class="footer flex-center">
          <slot name="footer">
            <madoka-btn @click="Root.ok" text="确 定" variant="outlined" color="pink" />
            <madoka-btn @click="Root.cancel" text="取 消" variant="outlined" color="#666" />
          </slot>
        </div>
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
  }>(),
  {
    footer: true,
  },
);
const modelValue = defineModel({
  default: false,
});
const emits = defineEmits<{
  (e: "cancel", event: Event): void
  (e: "ok", event: Event): void
}>()
const Root = (() => {
  const cancel = (e: Event) => {
    modelValue.value = false;
    emits("cancel", e)
  };
  const ok = (e:Event) => {
    modelValue.value = false;
    emits("ok", e)
  };
  const s = reactive({
    ok,
    cancel,
  });
  return s;
})();
</script>
<style lang="less" scoped>
.dialog__overlay {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  background: white;

  main {

  }

  footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    display: flex;

    .footer {
      margin-left: auto;
      padding: 20px;
      gap: 10px;
    }
  }
}
</style>