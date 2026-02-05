<template>
  <madoka-dialog v-model="Root.opened" title="发送留言" ok-text="发送" @ok="Root.ok">
    <textarea class="madoka-input" v-model="Root.text" placeholder="请输入留言内容"/>
  </madoka-dialog>
</template>

<script setup lang="ts">
import MadokaDialog from "@/components/MadokaDialog.vue";
import MessageApi from "@/api/MessageApi.ts"

const emits = defineEmits(["ok"]);

const Root = (() => {
  const open = () => {
    s.opened = true;
  };
  const ok = async () => {
    const res = await MessageApi.send({
      content: s.text,
    });
    s.opened = false;
    emits('ok', res);

  };
  const s = reactive({
    opened: false,
    text: "",
    open,
    ok,
  });
  return s;
})();
defineExpose({
  open: Root.open,
});
</script>

<style scoped>
.madoka-input {
  border: 1px solid pink;

  border-radius: 5px;
  width: 100%;
  height: 120px;
  &:focus {
    outline: none;
  }
}
</style>