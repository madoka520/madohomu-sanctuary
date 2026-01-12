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
    border: 1px solid pink;
    width: 150px;
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    user-select: none;

    &:hover {
      box-shadow: 0 4px 12px rgba(255, 192, 203, 100);
    }

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
