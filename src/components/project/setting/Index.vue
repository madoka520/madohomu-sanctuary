<template>
  <madoka-dialog :footer="false" v-model="Root.opened">
    <div class="form">
      <div class="form-item username">
        <label>用户名</label>
        <input />
      </div>
      <div class="form-item password">
        <pre>密  码</pre>
        <input type="password" />
      </div>
    </div>
  </madoka-dialog>
</template>

<script setup lang="ts">
import MadokaDialog from "@/components/MadokaDialog.vue"
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
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.form-item {
  display: flex;
  font-size: 14px;
  align-items: center;
  justify-content: center;
  font-family: "Arial", serif;
  font-weight: bold;
  gap: 10px;
  input {
    height: 30px;
  }
}
</style>
