<!-- =========start========== 关于系统 —— 原为空壳组件 -->
<template>
  <div class="about">
    <!-- 站点标识 -->
    <header class="about__header">
      <div class="brand">
        <span class="brand__zh">円焰之庭</span>
        <span class="brand__en">MadoHomu Sanctuary</span>
      </div>
      <p class="tagline">{{ $t('about.tagline') }}</p>
      <!-- =========start========== ◆ 宝石饰件分隔线(全局 gem.less) -->
      <div class="gem-divider">
        <span class="line"></span>
        <span class="gem"></span>
        <span class="line line--rev"></span>
      </div>
      <!-- ========end======== -->
    </header>

    <!-- 关于本站 -->
    <section class="about__section">
      <h3 class="gem-label"><i class="mdi mdi-heart-outline" /> {{ $t('about.siteTitle') }}</h3>
      <p>{{ $t('about.siteDesc') }}</p>
    </section>

    <!-- 功能一览 -->
    <section class="about__section">
      <h3 class="gem-label"><i class="mdi mdi-star-four-points-outline" /> {{ $t('about.featuresTitle') }}</h3>
      <ul class="feature-list">
        <li><i class="mdi mdi-message-processing" /> {{ $t('about.features.board') }}</li>
        <li><i class="mdi mdi-music-note-outline" /> {{ $t('about.features.player') }}</li>
        <li><i class="mdi mdi-hand-heart-outline" /> {{ $t('about.features.live2d') }}</li>
        <li><i class="mdi mdi-theme-light-dark" /> {{ $t('about.features.theme') }}</li>
        <li><i class="mdi mdi-water" /> {{ $t('about.features.water') }}</li>
        <li><i class="mdi mdi-loading" /> {{ $t('about.features.splash') }}</li>
      </ul>
    </section>

    <!-- 小秘密 -->
    <section class="about__section">
      <h3 class="gem-label"><i class="mdi mdi-diamond-stone" /> {{ $t('about.secretsTitle') }}</h3>
      <ul class="feature-list">
        <li><i class="mdi mdi-cake-variant-outline" /> {{ $t('about.secrets.birthday') }}</li>
        <li><i class="mdi mdi-emoticon-blush-outline" /> {{ $t('about.secrets.shy') }}</li>
        <li><i class="mdi mdi-weather-night" /> {{ $t('about.secrets.night') }}</li>
      </ul>
    </section>

    <!-- 技术栈 -->
    <section class="about__section">
      <h3 class="gem-label"><i class="mdi mdi-code-braces" /> {{ $t('about.techTitle') }}</h3>
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
        {{ $t('about.copyright') }}
      </p>
      <p class="slogan">{{ $t('about.slogan') }}</p>
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
