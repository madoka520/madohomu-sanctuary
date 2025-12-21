<template>
  <div class="card">
    <slot/>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.card {
  background: rgba(255, 255, 255, 0.3);
  height: 500px;
  width: 370px;
  border: 1px solid;
  /* 让文字乖乖换行 */
  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;
  /* 关键：不让卡片被压缩 */
  flex-shrink: 0;

  border-radius: 12px;
  padding: 10px;
}
</style>
