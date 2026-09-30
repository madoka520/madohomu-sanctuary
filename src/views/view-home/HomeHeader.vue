<template>
  <!-- 顶部导航 -->
  <nav ref="headerRef" class="flex nav" tabindex="-1">
    <div class="flex left-entry">
      <span class="mado">Mado</span>
      <span class="homu">Homu</span>
      <span class="sanctuary">Sanctuary</span>
    </div>
    <div class="flex-center center-entry">
      <madoka-desk-lrc class="desk-lrc" />
    </div>
    <div class="right-entry">
      <madoka-player-controls playing class="show-with-hover" />
      <a class="friend-link show-with-hover" @click="openFriendLinks">{{ $t('nav.friendLinks') }}</a>
      <!-- =========start========== GitHub 仓库入口，与友链同排悬浮渐显 -->
      <a
        class="github-link show-with-hover"
        href="https://github.com/madoka520/madohomu-sanctuary"
        target="_blank"
        rel="noreferrer"
        :title="$t('misc.githubRepo')"
      >
        <i class="mdi mdi-github" />
      </a>
      <!-- ========end======== -->
      <div class="avatar-frame" @click="settingStore.open()">
        <madoka-avatar :width="46" />
      </div>
    </div>
    <pre-firend-links ref="friendLinksRef" />
  </nav>
</template>

<script setup lang="ts">
import MadokaPlayerControls from '@/components/madoka-mini-player-controls/Index.vue'
import MadokaDeskLrc from '@/components/MadokaDeskLrc.vue'
import MadokaAvatar from '@/components/MadokaAvatar.vue'
import PreFirendLinks from '@/views/view-home/PreFirendLinks.vue'
import useSetting from '@/hooks/useSetting.ts'
const friendLinksRef = useTemplateRef('friendLinksRef')
const settingStore = useSetting()
const openFriendLinks = () => {
  friendLinksRef.value?.open()
}

// =========start========== 修复：点击导航栏后焦点落在 nav 上，留言区手势滚动会拦截后续点击的默认焦点转移，
// 导致 :focus-within 玻璃态卡住不消失；参考 SideDrawer 的 peekPanelRef.blur() 方案手动失焦，
// 用 pointerdown 捕获阶段监听（先于手势的 preventDefault 执行，保证可靠触发）
const headerRef = useTemplateRef<HTMLElement>('headerRef')
onMounted(() => {
  document.addEventListener(
    'pointerdown',
    (e) => {
      const el = headerRef.value
      if (el && !el.contains(e.target as Node)) el.blur()
    },
    true,
  )
})
// ========end========
</script>

<style scoped lang="less">
/* 导航 */
.show-with-hover {
  opacity: 0;
  transition: opacity 0.2s;
}
.nav {
  position: fixed;
  left: 0;
  right: 0;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  height: 60px;
  z-index: 2;
  // =========start========== tabindex=-1 的 nav 点击后获得焦点，再按键时浏览器会在整个导航栏外沿画默认黑框，这里按掉
  outline: none;
  // ========end========
  transition:
    background 0.3s ease,
    box-shadow 0.3s ease;
  &:hover,
  &:focus-within {
    background: rgba(255, 200, 220, 0.8);
    box-shadow: 0 4px 12px rgba(255, 128, 180, 0.2);
    backdrop-filter: blur(6px);
    .show-with-hover {
      opacity: 1;
    }
    /* LR_小さな狐の妖精 导航栏悬浮时歌词加深 */
    .desk-lrc {
      --lyric-base-color: #ff6b8a;
      --lyric-glow-color: rgba(255, 107, 138, 0.8);
      --lyric-dim-color: rgba(200, 100, 120, 0.3);
    }
  }
}
.left-entry {
  font-size: clamp(18px, 2.5vw, 1.8rem);

  font-weight: bold;
  height: 100%;
  padding-left: 20px;
  padding-right: 10px;
  align-items: center;

  user-select: none;
  font-family: 'cute', 'Helvetica Rounded', Arial, sans-serif;
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
}

.center-entry {
  flex: 1;
}

.friend-link {
  font-size: 14px;
  color: #ff6b8a;
  font-weight: 600;
  user-select: none;
  transition: opacity 0.2s;
  cursor: default;
  text-decoration: none; // 👈 关键在这里
  &:hover {
    opacity: 0.7;
  }
}

/* =========start========== GitHub 图标：与友链同色系，hover 放大发光 */
.github-link {
  display: flex;
  align-items: center;
  font-size: 20px;
  color: #ff6b8a;
  text-decoration: none;
  // 👉 有 href 的链接可被聚焦，浏览器默认黑色焦点框在粉色导航上很丑，去掉换成光晕
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  .mdi {
    text-shadow: 0 1px 2px rgba(255, 120, 180, 0.4);
  }
  &:hover {
    transform: scale(1.18) rotate(-8deg);
    color: #ff4f7e;
    text-shadow: 0 0 8px rgba(255, 105, 180, 0.65);
  }
  // 键盘聚焦时的可见反馈（保留可访问性）：粉色光晕代替黑框
  &:focus-visible .mdi {
    text-shadow: 0 0 10px rgba(255, 105, 180, 0.95);
  }
}
/* ========end======== */
.right-entry {
  padding-right: 10px;
  display: flex;
  align-items: center;
  gap: 30px;
}
</style>
