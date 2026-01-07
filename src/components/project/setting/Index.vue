<template>
  <madoka-dialog :footer="false" v-model="Root.opened">
    <login v-if="!tokenStore.token"/>

  </madoka-dialog>
</template>

<script setup lang="ts">
import MadokaDialog from "@/components/MadokaDialog.vue"
import Login from "@/components/project/setting/Login.vue"
import useToken from "@/hooks/useToken.ts"
const tokenStore = useToken()
defineOptions({
  name: "Setting",
})


const Root = (() => {
  const open = () => {
    s.opened = true
  }
  const s = reactive({
    opened: false,
    open,
  })
  return s
})()
defineExpose({
  open: Root.open,
})
</script>

<style scoped>

</style>
