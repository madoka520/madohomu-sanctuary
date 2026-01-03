<template>
  <!-- 顶部导航 -->
  <nav class="nav">
    <div class="logo">
      <span class="mado">Mado</span><span class="homu">Homu</span>
      <span class="sanctuary"> Sanctuary </span>
    </div>
    <div class="search"></div>
    <div class="right-entry"></div>
    <!--      <ul class="nav-links">
            <li><a href="#">焰之回廊</a></li>
          </ul>-->
  </nav>
</template>

<script setup lang="ts"></script>

<style scoped>
/* 导航 */
.nav {
  display: flex;
  position: fixed;
  width: 100vw;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background: rgba(255, 200, 220, 0.5);
    box-shadow: 0 4px 12px rgba(255, 128, 180, 0.2);
    backdrop-filter: blur(6px);
  }
}

.mado {
  background: linear-gradient(135deg, #ff85a2, #ffb6c1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  text-shadow:
    0 0 2px white,
    0 1px 2px rgba(255, 120, 180, 0.5);
}

.homu {
  background: linear-gradient(135deg, #b388eb, #a470d1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  text-shadow:
    0 0 2px white,
    0 1px 2px rgba(170, 130, 255, 0.5);
}

.sanctuary {
  color: #a77bc7;
  margin-left: 0.4rem;
  text-shadow:
    0 0 2px white,
    0 1px 2px rgba(180, 140, 250, 0.5);
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
}

.nav-links a {
  text-decoration: none;
  color: #6d48a0;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #9b60c8;
}
</style>
