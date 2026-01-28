<template>
  <div :class="['submit-btn', { loading: loading }]" ref="ref_button">
    <span v-show="!loading">
      <slot>
        {{ text }}
      </slot>
    </span>
    <span v-show="loading">正在重构宇宙...</span>
  </div>
</template>
<script setup lang="ts">

const props = withDefaults(
  defineProps<{
    text?: string
  }>(),
  {},
)
const loading = defineModel("loading", {
  default: false,
})


</script>
<style scoped>
/* 提交按钮 */
.submit-btn {
  padding: 15px;
  background: linear-gradient(90deg, rgba(255, 142, 178, 0.1), rgba(255, 142, 178, 0.3), rgba(255, 142, 178, 0.1));
  border: 1px solid #ff8eb2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: "Cinzel", serif;
  font-weight: bold;
  font-size: 1.1rem;
  position: relative;
  user-select: none;
  overflow: hidden;
  transition: all 0.5s;
  text-shadow: 0 0 5px #ff8eb2;
  text-align: center;
}

.submit-btn:hover {
  background: #ff8eb2;
  color: white;
  box-shadow: 0 0 20px #ff8eb2;
}

.submit-btn.loading {
  background: #333;
  color: #777;
  cursor: not-allowed;
  border-color: #555;
  box-shadow: none;
}
</style>
