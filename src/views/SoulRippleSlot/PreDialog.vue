<template>
  <madoka-dialog v-model="Root.opened" title="心灵涟漪">

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
    open
  });
  return s;
})();
defineExpose({
  open: Root.open
})
</script>

<style scoped>

</style>