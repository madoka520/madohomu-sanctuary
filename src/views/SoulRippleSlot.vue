<template>
  <div class="bg w-full h-full">
    <div class="overlay flex w-full h-full justify-center flex-col">
      <div class="text-center">
        心灵涟漪
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.bg {
  background: url("@/assets/images/madoka_pic/1.jpg") no-repeat center;
  background-size: cover;
  .overlay {
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    background-color: rgba(0, 0, 0, 0.5); /* 半透明黑底 */
    color: white;
    &:hover {
      opacity: 1;
      backdrop-filter: blur(4px); /* 🌸加点梦幻感 */
    }
  }
}
</style>