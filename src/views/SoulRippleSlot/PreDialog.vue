<template>
  <madoka-dialog v-model="Root.opened" title="发送留言" ok-text="发送" @ok="Root.ok">
    <textarea class="madoka-input" v-model="Root.text" />
  </madoka-dialog>
</template>

<script setup lang="ts">
import MadokaDialog from "@/components/MadokaDialog.vue";
import SoulRippleApi from "@/api/SoulRippleApi.ts";

const Root = (() => {
  const open = () => {
    s.opened = true;
  };
  const ok = () => {
    SoulRippleApi.send({
      text: s.text,
    });
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
  height: 70%;
  &:focus {
    outline: none;
  }
}
</style>