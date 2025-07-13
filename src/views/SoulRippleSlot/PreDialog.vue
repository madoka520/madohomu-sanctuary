<template>
  <madoka-dialog v-model="Root.opened" title="心灵涟漪" ok-text="发送">
    <textarea class="madoka-input" v-model="Root.text"/>
  </madoka-dialog>
</template>

<script setup lang="ts">

import MadokaDialog from "@/components/MadokaDialog.vue";

const Root = (() => {
  const open = () => {
    s.opened = true
  };
  const s = reactive({
    opened: false,
    text: '',
    open
  });
  return s;
})();
defineExpose({
  open: Root.open
})
</script>

<style scoped>
.madoka-input {
  border-radius: 5px;
  &:focus {
    outline: none;
    border: 1px solid pink;
  }
}
</style>