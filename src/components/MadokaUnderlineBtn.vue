<template>
  <button class="button" data-text="Awesome">
    <span class="actual-text">&nbsp;<slot>{{text}}</slot>&nbsp;</span>
    <span aria-hidden="true" class="front-text">&nbsp;<slot>{{text}}</slot>&nbsp;</span>
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text?: string
  }>(),
  {

  }
)
</script>

<style scoped>
.button {
  padding: 0;
  position: relative;
  border: none;
  background: transparent;
  --stroke-color: #ffffff7c;
  --ani-color: rgba(95, 3, 244, 0);
  --color-gar: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
  letter-spacing: 3px;
  font-size: 2em;
  font-family: "Arial",serif;
  text-transform: uppercase;
  color: transparent;
  -webkit-text-stroke: 1px var(--stroke-color);
  cursor: pointer;
}

.front-text {
  white-space: nowrap;
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  background: var(--color-gar);
  -webkit-background-clip: text;
  background-clip: text;
  background-size: 200%;
  overflow: hidden;
  transition: all 1s;
  animation: 8s ani infinite;
  border-bottom: 2px solid transparent;
}

.button:hover .front-text {
  width: 100%;
  border-bottom: 2px solid #03a9f4;
  -webkit-text-stroke: 1px var(--ani-color);
}

@keyframes ani {
  0% {
    background-position: 0%;
  }

  50% {
    background-position: 400%;
  }

  100% {
    background-position: 0%;
  }
}

</style>