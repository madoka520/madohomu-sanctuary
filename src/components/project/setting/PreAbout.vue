<!-- =========start========== 关于系统 —— 原为空壳组件 -->
<template>
  <div class="about">
    <!-- 站点标识 -->
    <header class="about__header">
      <div class="brand">
        <span class="brand__zh">円焰之庭</span>
        <span class="brand__en">MadoHomu Sanctuary</span>
      </div>
      <p class="tagline">
        「要是别人说怀有希望是错误的事，不管几次我都一定会否定这句话。」
      </p>
    </header>

    <!-- 关于本站 -->
    <section class="about__section">
      <h3><i class="mdi mdi-heart-outline" /> 关于本站</h3>
      <p>
        一个为&lt;圆焰圆&gt;厨准备的小小角落 —— 《魔法少女小圆》鹿目圆 ×
        晓美焰主题粉丝社区。可以在这里留言、听歌、摸圆神，也可以什么都不做，
        只是安静地待在庭院里。
      </p>
    </section>

    <!-- 功能一览 -->
    <section class="about__section">
      <h3><i class="mdi mdi-star-four-points-outline" /> 功能一览</h3>
      <ul class="feature-list">
        <li><i class="mdi mdi-message-processing" /> 多来源留言板（本站 / madohomu.love / kami.im）</li>
        <li><i class="mdi mdi-music-note-outline" /> 34 首原声与角色歌播放器，逐字桌面歌词</li>
        <li><i class="mdi mdi-hand-heart-outline" /> Live2D 圆神看板：庭院里的神明，会回应你的每一次触碰</li>
        <li><i class="mdi mdi-theme-light-dark" /> 主题系统：kami / コネクト OP / 圆诞生日主题</li>
        <li><i class="mdi mdi-water" /> 首屏液面水波（鼠标划过荡开涟漪）</li>
        <li><i class="mdi mdi-loading" /> 円環の理 开屏动画</li>
      </ul>
    </section>

    <!-- 小秘密 -->
    <section class="about__section">
      <h3><i class="mdi mdi-diamond-stone" /> 庭院的小秘密</h3>
      <ul class="feature-list">
        <li><i class="mdi mdi-cake-variant-outline" /> 每年 10 月 3 日是小圆的生日 —— 当天庭院会自己换上生日装扮</li>
        <li><i class="mdi mdi-emoticon-blush-outline" /> 连续摸圆神同一个部位，她会害羞哦</li>
        <li><i class="mdi mdi-weather-night" /> 深夜来访，神明的问候也会不一样</li>
      </ul>
    </section>

    <!-- 技术栈 -->
    <section class="about__section">
      <h3><i class="mdi mdi-code-braces" /> 技术栈</h3>
      <div class="chips">
        <span v-for="t in techList" :key="t" class="chip">{{ t }}</span>
      </div>
    </section>

    <!-- 链接与版权 -->
    <footer class="about__footer">
      <a
        class="repo"
        href="https://github.com/madoka520/madohomu-sanctuary"
        target="_blank"
        rel="noreferrer"
      >
        <i class="mdi mdi-github" /> madoka520/madohomu-sanctuary
      </a>
      <p class="copyright">
        「魔法少女まどか☆マギカ」© Magica Quartet / Aniplex・Madoka Project / SHAFT<br />
        本站为非营利粉丝二次创作，原作相关权利归其权利方所有
      </p>
      <p class="slogan">圆与焰的庭院，永远盛开着希望之花 🌸</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'pre-about' })

const techList = [
  'Vue 3.5',
  'Vite 6',
  'Pinia',
  'Less',
  'Three.js 液面',
  'PIXI Live2D',
  '@madoka520/vue-ui',
  'Fastify + MySQL',
]
</script>

<style scoped lang="less">
@pink-primary: #ffb7c5;
@pink-dark: #ff85a2;
@rose-text: #665a5c;
@rose-sub: rgba(102, 90, 92, 0.65);

.about {
  display: flex;
  flex-direction: column;
  gap: 26px;
  font-size: 13.5px;
  line-height: 1.8;
  color: @rose-text;
}

// 站点标识：渐变字 + 引言
.about__header {
  .brand {
    display: flex;
    align-items: baseline;
    gap: 12px;

    &__zh {
      font-family: 'cute', 'Helvetica Rounded', Arial, sans-serif;
      font-size: 26px;
      font-weight: 700;
      background: linear-gradient(135deg, #ff85a2, #b388eb);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 0 10px rgba(255, 133, 162, 0.3));
    }

    &__en {
      font-size: 12px;
      letter-spacing: 0.22em;
      color: @rose-sub;
    }
  }

  .tagline {
    margin: 6px 0 0;
    font-size: 12.5px;
    color: @rose-sub;
  }
}

// 分区：粉色左线标题（默认形态：直角 + 细线）
.about__section {
  h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 10px;
    padding-left: 10px;
    font-size: 14px;
    font-weight: 600;
    color: @pink-dark;
    border-left: 3px solid @pink-primary;

    .mdi {
      font-size: 16px;
    }
  }

  p {
    margin: 0;
  }
}

.feature-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    display: flex;
    align-items: center;
    gap: 10px;

    .mdi {
      flex-shrink: 0;
      font-size: 16px;
      color: @pink-dark;
    }
  }
}

// 技术栈 chips：直角细边框
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .chip {
    padding: 3px 10px;
    font-size: 12px;
    color: @rose-text;
    background: transparent;
    border: 1px solid rgba(255, 133, 162, 0.45);
  }
}

.about__footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 183, 197, 0.4);

  .repo {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: @pink-dark;
    text-decoration: none;
    width: fit-content;
    transition: opacity 0.25s ease;

    &:hover {
      opacity: 0.7;
    }
  }

  .copyright {
    margin: 0;
    font-size: 11.5px;
    line-height: 1.7;
    color: @rose-sub;
  }

  .slogan {
    margin: 0;
    font-size: 12.5px;
    color: @pink-dark;
  }
}
</style>
