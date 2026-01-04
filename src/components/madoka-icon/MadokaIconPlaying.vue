<template>
  <span class="playing-indicator">
    <span></span>
    <span></span>
    <span></span>
  </span>
</template>

<script setup lang="ts"></script>

<style scoped>
.playing-indicator {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 16px;
}

.playing-indicator span {
  width: 3px;
  background: pink;
  border-radius: 2px;
  animation: equalizer 1s infinite ease-in-out;
}

.playing-indicator span:nth-child(1) {
  animation-delay: 0s;
}
.playing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}
.playing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes equalizer {
  0% {
    height: 4px;
  }
  50% {
    height: 16px;
  }
  100% {
    height: 6px;
  }
}
</style>
