<template>

</template>

<script setup lang="ts">
import SoulRippleApi from "@/api/SoulRippleApi.ts";

const Form = (() => {
  const s = reactive({
    params: {}
  });
  return s;
})();
const Root = (() => {
  const getList = async () => {
    const res = await SoulRippleApi.list(Form.params)
    s.list = res.data
  };
  const s = reactive({
    list: []
  });
  return s;
})();
</script>

<style scoped></style>
