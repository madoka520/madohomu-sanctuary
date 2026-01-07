<script setup>
import { ref } from 'vue'

const formData = ref({
  name: '',
  wish: '', // Email or Request
  soulGemType: 'pink'
})

const isSubmitting = ref(false)

const handleContract = () => {
  isSubmitting.value = true
  // 模拟签订契约的过程
  setTimeout(() => {
    alert('／人◕ ‿‿ ◕人＼\n契约已成立！你的愿望甚至能凌驾于熵之上！')
    isSubmitting.value = false
    formData.value = { name: '', wish: '', soulGemType: 'pink' }
  }, 2000)
}
</script>

<template>
  <div class="labyrinth-container">
    <!-- 背景漂浮的魔女符号 -->
    <div class="rune rune-1"></div>
    <div class="rune rune-2"></div>
    <div class="rune rune-3"></div>

    <div class="contract-card">
      <div class="kyubey-eyes">
        <div class="eye left"></div>
        <div class="eye right"></div>
      </div>

      <h1 class="title">
        <span class="rune-text">CONTRACT</span><br>
        签订契约
      </h1>

      <p class="subtitle">告诉我，你的愿望是什么？</p>

      <form @submit.prevent="handleContract" class="magical-form">

        <div class="input-group">
          <label>少女之名 (Name)</label>
          <input
            v-model="formData.name"
            type="text"
            required
            placeholder="鹿目 圆"
          />
          <div class="glow-bar"></div>
        </div>

        <div class="input-group">
          <label>奇迹的代价 (Wish/Email)</label>
          <input
            v-model="formData.wish"
            type="text"
            required
            placeholder="无论发生什么，我都不会绝望..."
          />
          <div class="glow-bar"></div>
        </div>

        <div class="soul-gem-selector">
          <p>选择你的灵魂宝石颜色</p>
          <div class="gems">
            <label class="gem-option pink">
              <input type="radio" value="pink" v-model="formData.soulGemType">
              <span class="gem"></span>
            </label>
            <label class="gem-option purple">
              <input type="radio" value="purple" v-model="formData.soulGemType">
              <span class="gem"></span>
            </label>
            <label class="gem-option yellow">
              <input type="radio" value="yellow" v-model="formData.soulGemType">
              <span class="gem"></span>
            </label>
            <label class="gem-option blue">
              <input type="radio" value="blue" v-model="formData.soulGemType">
              <span class="gem"></span>
            </label>
            <label class="gem-option red">
              <input type="radio" value="red" v-model="formData.soulGemType">
              <span class="gem"></span>
            </label>
          </div>
        </div>

        <button type="submit" :class="['submit-btn', { 'loading': isSubmitting }]">
          <span v-if="!isSubmitting">成为魔法少女</span>
          <span v-else>正在重构宇宙...</span>
        </button>
      </form>

      <div class="footer-decoration">
        Entropie × Incubator
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 引入哥特风格字体 */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=IM+Fell+English+SC&display=swap');

/* 核心变量：定义小圆风格的配色 */
:root {
  --madoka-pink: #ff8eb2;
  --homura-purple: #3e265c;
  --mami-gold: #f5c542;
  --sayaka-blue: #4dabf5;
  --kyoko-red: #d93025;
  --witch-dark: #1a0b2e;
  --text-glow: 0 0 10px rgba(255, 142, 178, 0.6);
}

.labyrinth-container {
  font-family: 'Cinzel', serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #0f0518;
  /* 制作类似魔女结界的格子背景 */
  background-image:
    linear-gradient(45deg, #1a0b2e 25%, transparent 25%, transparent 75%, #1a0b2e 75%, #1a0b2e),
    linear-gradient(45deg, #1a0b2e 25%, transparent 25%, transparent 75%, #1a0b2e 75%, #1a0b2e);
  background-size: 60px 60px;
  background-position: 0 0, 30px 30px;
  position: relative;
  overflow: hidden;
  color: #fff;
}

/* 漂浮的魔女符号 (CSS绘制) */
.rune {
  position: absolute;
  opacity: 0.3;
  pointer-events: none;
  animation: float 10s infinite ease-in-out;
}
.rune-1 {
  top: 10%; left: 10%;
  width: 100px; height: 100px;
  border: 2px solid var(--madoka-pink);
  border-radius: 50%;
  box-shadow: 0 0 15px var(--madoka-pink);
  border-style: dotted;
}
.rune-2 {
  bottom: 20%; right: 10%;
  width: 80px; height: 80px;
  border: 1px solid var(--mami-gold);
  transform: rotate(45deg);
  animation-duration: 15s;
}
.rune-3 {
  top: 40%; left: 50%;
  width: 150px; height: 150px;
  background: radial-gradient(circle, transparent 60%, rgba(77, 171, 245, 0.2) 70%);
  border-radius: 50%;
  filter: blur(5px);
}

.contract-card {
  position: relative;
  width: 400px;
  padding: 40px;
  background: rgba(20, 10, 30, 0.95);
  border: 2px solid #4a3b69;
  box-shadow:
    0 0 30px rgba(0, 0, 0, 0.8),
    inset 0 0 50px rgba(62, 38, 92, 0.5);
  border-radius: 4px;
  /* 珂拉琪风格的边框装饰 */
  border-image: linear-gradient(to bottom, #ff8eb2, #3e265c) 1;
  z-index: 10;
  backdrop-filter: blur(5px);
}

/* 丘比的眼睛装饰 */
.kyubey-eyes {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  opacity: 0.8;
}
.eye {
  width: 15px;
  height: 15px;
  background: #d93025;
  border-radius: 50%;
  box-shadow: 0 0 10px #d93025;
  position: relative;
}
.eye::after {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 25px;
  height: 25px;
  border: 1px solid #d93025;
  border-radius: 50%;
  animation: pulse 3s infinite;
}

.title {
  text-align: center;
  font-family: 'IM Fell English SC', serif;
  color: #ff8eb2;
  text-shadow: 0 0 10px #ff8eb2;
  margin-bottom: 10px;
  line-height: 1.2;
}
.rune-text {
  font-size: 0.8em;
  letter-spacing: 5px;
  color: #666;
  filter: blur(0.5px); /* 模拟看不懂的文字 */
}

.subtitle {
  text-align: center;
  font-size: 0.9em;
  color: #a8a0b5;
  margin-bottom: 30px;
  font-style: italic;
}

.input-group {
  margin-bottom: 25px;
  position: relative;
}

label {
  display: block;
  font-size: 0.8rem;
  color: #bfa8d6;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid #5a4b7a;
  padding: 10px 0;
  color: #fff;
  font-family: 'Cinzel', serif;
  font-size: 1.1rem;
  outline: none;
  transition: all 0.3s ease;
}

input:focus {
  border-bottom-color: #ff8eb2;
}

/* 底部发光条动画 */
.glow-bar {
  height: 1px;
  width: 0;
  background: #ff8eb2;
  box-shadow: 0 0 10px #ff8eb2;
  transition: width 0.4s ease;
}
input:focus + .glow-bar {
  width: 100%;
}

/* 灵魂宝石选择器 */
.soul-gem-selector {
  margin: 30px 0;
  text-align: center;
}
.soul-gem-selector p {
  font-size: 0.8rem;
  color: #bfa8d6;
  margin-bottom: 10px;
}
.gems {
  display: flex;
  justify-content: center;
  gap: 15px;
}
.gem-option input {
  display: none;
}
.gem {
  display: block;
  width: 24px;
  height: 34px;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; /* 蛋形 */
  cursor: pointer;
  transition: transform 0.2s;
  border: 2px solid #fff;
  opacity: 0.5;
}

/* 宝石颜色定义 */
.gem-option.pink .gem { background: #ff8eb2; box-shadow: 0 0 5px #ff8eb2; }
.gem-option.purple .gem { background: #9b59b6; box-shadow: 0 0 5px #9b59b6; }
.gem-option.yellow .gem { background: #f1c40f; box-shadow: 0 0 5px #f1c40f; }
.gem-option.blue .gem { background: #3498db; box-shadow: 0 0 5px #3498db; }
.gem-option.red .gem { background: #e74c3c; box-shadow: 0 0 5px #e74c3c; }

.gem-option input:checked + .gem {
  opacity: 1;
  transform: scale(1.2);
  box-shadow: 0 0 15px currentColor;
  border-color: #fff;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(90deg, rgba(255,142,178,0.1), rgba(255,142,178,0.3), rgba(255,142,178,0.1));
  border: 1px solid #ff8eb2;
  color: #ff8eb2;
  font-family: 'Cinzel', serif;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.5s;
  text-shadow: 0 0 5px #ff8eb2;
}

.submit-btn:hover {
  background: #ff8eb2;
  color: #1a0b2e;
  box-shadow: 0 0 20px #ff8eb2;
}

.submit-btn.loading {
  background: #333;
  color: #777;
  cursor: not-allowed;
  border-color: #555;
  box-shadow: none;
}

.footer-decoration {
  margin-top: 30px;
  text-align: center;
  font-size: 0.7rem;
  color: #4a3b69;
  letter-spacing: 3px;
  border-top: 1px solid #2a1b39;
  padding-top: 10px;
}

/* 动画定义 */
@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}
</style>
