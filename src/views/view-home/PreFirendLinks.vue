<template>
  <madoka-dialog
    v-model="opened"
    background="transparent"
    :footer="false"
    ghost
  >
    <div class="friend-links-container">
      <div class="header-section">
        <h1 class="title">因果节点 · 观测枢</h1>
        <div class="title-decoration">
          <span class="line left"></span>
          <div class="magic-star"></div>
          <span class="line right"></span>
        </div>
        <p class="subtitle">PURE DESTINY SYNCHRONIZATION</p>
      </div>

      <div class="links-grid">
        <madoka-magic-card
          v-for="link in links"
          :key="link.url"
          :link="link"
          @click="openLink(link.url)"
        />
      </div>

      <!--      <div class="submit-section">
        <div class="glass-input-group">
          <div class="input-prefix">WISH:</div>
          <input
            v-model="newLinkName"
            type="text"
            placeholder="Input your ID..."
            class="cyber-input"
          />
          <button class="cyber-button" @click="submitRequest">
            <span class="btn-text">SIGN_CONTRACT</span>
          </button>
        </div>
      </div>-->
    </div>
  </madoka-dialog>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-unified'
import MadokaDialog from '@/components/MadokaDialog.vue'
import MadokaMagicCard from '@/components/MadokaMagicCard.vue'

interface FriendLink {
  name: string
  url: string
  avatar: string
  description: string
}
const opened = defineModel({
  default: false,
})
const newLinkName = defineModel<string>('linkName', { default: '' })

const links = shallowRef<FriendLink[]>([
  {
    name: '圆焰圆cp站',
    url: 'https://madohomu.love/',
    avatar: 'https://haojiezhe12345.top:82/madohomu/res/favicon-320.png',
    description: '这里是鹿目圆×晓美焰的主题网站',
  },
  {
    name: '记忆之国',
    url: 'https://memory-realm-madoka.top/',
    avatar: 'https://memory-realm-madoka.top/favicon.ico',
    description:
      '欢迎来到记忆之国\n' + '收录同人作品、魔圆百科设定与精美画廊。',
  },
  {
    name: 'XingHuiSamaの宝藏之地',
    url: 'https://www.xinghuisama.top',
    avatar: 'https://bu.dusays.com/2026/03/24/69c1e38ac1846.jpg',
    description: '今天我也要学习吗',
  },
  {
    name: '胡杨怕火',
    url: 'https://funingna-wakawaka.github.io/',
    avatar: 'https://funingna-wakawaka.github.io/images/0.png',
    description: '传递笑容魔法的Ciallo～(∠・ω< )⌒☆',
  },
])

const openLink = (url: string) => {
  window.open(url, '_blank')
}

const submitRequest = debounce(() => {
  console.log('Contract Signed:', newLinkName.value)
}, 300)

defineExpose({
  open: () => {
    opened.value = true
  },
})
</script>

<style lang="less" scoped>
/* 亮色系魔法少女粉变量 */
@bright-pink-bg: #fff5f7;
@madoka-primary: #ff85a2;
@madoka-secondary: #ffb7c5;
@text-main: #6b444d;

.friend-links-container {
  min-height: 85vh;
  padding: 60px 40px;
  background-color: transparent;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  color: @text-main;
  position: relative;
  overflow: hidden;

  /* 明亮流体背景装饰 */
  .light-fluid-bg {
    position: absolute;
    inset: 0;
    filter: blur(80px);
    z-index: 0;
    opacity: 0.6;

    .blob {
      position: absolute;
      border-radius: 50%;
      &:nth-child(1) {
        width: 400px;
        height: 400px;
        top: -100px;
        left: -100px;
        animation: float-slow 15s infinite alternate;
      }
      &:nth-child(2) {
        width: 350px;
        height: 350px;
        bottom: -50px;
        right: -50px;
        background: #ffe0e9;
        animation: float-slow 12s infinite alternate-reverse;
      }
    }
  }

  .header-section {
    text-align: center;
    margin-bottom: 80px;
    position: relative;
    z-index: 2;

    user-select: none;
    .title {
      font-size: 3.2rem;
      font-weight: 900;
      letter-spacing: 6px;
      background: linear-gradient(135deg, @madoka-primary, #ff4f81);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 2px 4px rgba(255, 133, 162, 0.2));
    }

    .title-decoration {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin: 15px 0;

      .line {
        height: 2px;
        width: 60px;
        background: @madoka-secondary;
        border-radius: 2px;
      }

      .magic-star {
        width: 12px;
        height: 12px;
        background: @madoka-primary;
        clip-path: polygon(
          50% 0%,
          61% 35%,
          98% 35%,
          68% 57%,
          79% 91%,
          50% 70%,
          21% 91%,
          32% 57%,
          2% 35%,
          39% 35%
        );
        box-shadow: 0 0 10px @madoka-primary;
      }
    }

    .subtitle {
      color: @madoka-primary;
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 3px;
    }
  }

  .links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 35px;
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }

  .submit-section {
    margin-top: 100px;
    padding-bottom: 50px;
    position: relative;
    z-index: 2;

    .glass-input-group {
      margin: 0 auto;
      width: fit-content;
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.7);
      padding: 6px;
      border: 2px solid @madoka-secondary;
      border-radius: 50px; /* 亮色系多用圆润线条 */
      backdrop-filter: blur(10px);
      box-shadow: 0 10px 25px rgba(255, 183, 197, 0.3);

      .input-prefix {
        padding-left: 20px;
        font-size: 0.8rem;
        font-weight: 800;
        color: @madoka-primary;
      }

      .cyber-input {
        background: transparent;
        border: none;
        outline: none;
        color: @text-main;
        padding: 12px;
        width: 280px;
        font-family: inherit;
        &::placeholder {
          color: @madoka-secondary;
        }
      }

      .cyber-button {
        background: @madoka-primary;
        border: none;
        padding: 12px 30px;
        cursor: pointer;
        border-radius: 25px;
        margin-right: 2px;
        transition: all 0.3s ease;

        &:hover {
          background: #ff4f81;
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(255, 79, 129, 0.4);
        }

        .btn-text {
          color: #fff;
          font-weight: 900;
          font-size: 0.85rem;
          letter-spacing: 1px;
        }
      }
    }
  }
}

@keyframes float-slow {
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(30px, 40px);
  }
}

@keyframes title-flow {
  to {
    background-position: 200% center;
  }
}
</style>
