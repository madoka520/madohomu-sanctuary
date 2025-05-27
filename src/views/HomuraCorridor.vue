<template>
  <div class="corridor">
    <h2>焰之回廊</h2>
    <div class="timeline">
      <div v-for="item in memories" :key="item.id" class="entry">
        <div class="dot"></div>
        <div class="content">
          <h4>{{ item.title }}</h4>
          <p>{{ item.desc }}</p>
          <span class="time">{{ item.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const memories = [
  { id: 1, title: '初遇小圆', desc: '那是命运交错的开始。', time: '第一时间线' },
  { id: 2, title: '魔女结界', desc: '只要我努力，她就不会哭泣。', time: '第三次轮回' },
  { id: 3, title: '时间的牢笼', desc: '哪怕世界毁灭，我也不会放手。', time: '最终轮回' },
]
</script>

<style scoped>
.corridor {
  background: linear-gradient(to bottom, #fdf0f5, #eae2ff);
  padding: 3rem 1.5rem;
  font-family: 'Segoe UI', 'Hiragino Sans', sans-serif;
  color: #5e348e;
}

h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.timeline {
  border-left: 3px dashed #c3a8e6;
  padding-left: 1.5rem;
  margin-left: 1rem;
}

.entry {
  margin-bottom: 2rem;
  position: relative;
}

.dot {
  width: 14px;
  height: 14px;
  background: #9f69e1;
  border-radius: 50%;
  position: absolute;
  left: -1.2rem;
  top: 4px;
}

.content h4 {
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
}

.time {
  font-size: 0.85rem;
  color: #aa88cc;
}
</style>
