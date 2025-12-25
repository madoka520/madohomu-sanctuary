<template>
  <div class="card__wrapper">
    <div class="card">
      <slot/>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.card__wrapper {
  padding: 20px 5px 5px;

  .card {
    background: rgba(255, 255, 255, 0.3);
    height: 500px;
    width: 370px;
    /* 让文字乖乖换行 */
    white-space: normal;
    padding: 10px;
    overflow: auto;
    border-radius: 12px;
  }
}

</style>
