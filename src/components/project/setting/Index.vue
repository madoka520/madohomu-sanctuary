<template>
  <madoka-dialog :footer="false" v-model="settingStore.opened">
    <login v-if="!tokenStore.token" />

    <div v-else class="content">
      <madoka-slidebar
        :list="Setting.list.map((item) => item.title)"
        v-model="Setting.current"
      >
        <template #title>
          <i class="mdi mdi-cog"></i>
          {{ $t('settings.center') }}
        </template>
      </madoka-slidebar>

      <div class="main">
        <transition name="fade" mode="out-in">
          <component :is="Setting.list[Setting.current].component" />
        </transition>
      </div>
    </div>
  </madoka-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { MadokaDialog } from '@madoka520/vue-ui'
import Login from '@/components/project/setting/Login.vue'
import useToken from '@/hooks/useToken.ts'
import { MadokaSlidebar } from '@madoka520/vue-ui'
import useSetting from '@/hooks/useSetting.ts'
// =========start========== i18n：菜单标题随语言切换
import { useI18n } from 'vue-i18n'
// ========end========

const tokenStore = useToken()
const toAsyncComponent = <T extends Component>(comp: () => Promise<T>) =>
  markRaw(defineAsyncComponent(comp))

defineOptions({
  name: 'Setting',
})
const settingStore = useSetting()
// =========start========== i18n：菜单标题用 computed 保持语言切换时的响应性；
// 异步组件缓存到外面，避免每次换语言都重建组件导致页面重挂载
const { t } = useI18n()
const Setting = (() => {
  const components = {
    theme: toAsyncComponent(
      () => import('@/components/project/setting/PreThemeSetting.vue'),
    ),
    account: toAsyncComponent(
      () => import('@/components/project/setting/PreAccountMgr.vue'),
    ),
    language: toAsyncComponent(
      () => import('@/components/project/setting/PreLanguageSetting.vue'),
    ),
    about: toAsyncComponent(
      () => import('@/components/project/setting/PreAbout.vue'),
    ),
  }
  const list = computed(() => [
    { title: t('settings.theme'), component: components.theme },
    { title: t('settings.account'), component: components.account },
    { title: t('settings.language'), component: components.language },
    { title: t('settings.about'), component: components.about },
  ])
  const s = reactive({
    current: 0,
    list,
  })
  return s
})()
// ========end========

const Root = (() => {
  const open = () => {
    s.opened = true
  }
  const s = reactive({
    opened: false,
    open,
  })
  return s
})()

defineExpose({
  open: Root.open,
})
</script>

<style scoped lang="less">
// 🌸 梦幻毛玻璃配色变量
@glass-bg: rgba(255, 255, 255, 0.65); // 整体背景半透明
@glass-border: rgba(255, 255, 255, 0.8); // 玻璃边缘高光
@sakura-pink: #ffb7c5; // 樱花粉
@text-main: #665a5c; // 柔和的深褐灰

.content {
  display: flex;
  width: clamp(600px, 31vw, 800px);
  height: clamp(110px, 47vh, 600px);
  // 原代码 - Codex 保留（整容器滚动，长内容会把侧边栏一起带走）
  // overflow: auto;
  // =========start========== 滚动下沉：容器自身裁切，只让右侧内容区内部滚
  overflow: hidden;
  // ========end========
  font-family: 'PingFang SC', sans-serif;
  color: @text-main;

  // --- 右侧内容区 ---
  .main {
    flex: 1;
    // 右侧完全通透，利用 content 的毛玻璃底
    background: transparent;
    padding: 40px;
    height: 100%;
    display: flex;
    flex-direction: column;
    // =========start========== 内容区内部滚动，侧边栏保持固定
    overflow-y: auto;
    min-width: 0;
    // ========end========
  }
}

// 简单的淡入淡出过渡
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
