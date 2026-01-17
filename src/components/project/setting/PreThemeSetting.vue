<template>
  <div class="theme-select-container">
    <div v-for="(item, index) in setting.themeList" class="theme-option" @click="() => (setting.theme = index)">
      <img :src="item.cover" alt="" />
      <div class="name">{{ item.name }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import useSetting from "@/hooks/useSetting.ts"

const setting = useSetting()
</script>

<style scoped>
.theme-select-container {
  display: flex;
  gap: 30px;
  .theme-option {
    width: 150px;
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    user-select: none;


    img {
      width: auto;
      height: 80px;

      &:hover {
        scale: 1.1;
        transition: scale 0.1s;
      }
    }
    .name {
      text-align: center;
    }
  }
}
</style>
