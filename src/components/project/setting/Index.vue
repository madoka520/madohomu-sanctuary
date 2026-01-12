<template>
  <madoka-dialog :footer="false" v-model="Root.opened">
    <login v-if="!tokenStore.token" />

    <div v-else class="content">
      <madoka-slidebar :list="Setting.list.map(item => item.title)" v-model="Setting.current">
        <template #title> <i class="mdi mdi-cog"></i> 设置中心 </template>
      </madoka-slidebar>

      <div class="main">
        <div class="main__body">
          <transition name="fade" mode="out-in">
            <div :key="Setting.current" class="content-wrapper">
              <component :is="Setting.list[Setting.current].component"/>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </madoka-dialog>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import MadokaDialog from "@/components/MadokaDialog.vue"
import Login from "@/components/project/setting/Login.vue"
import useToken from "@/hooks/useToken.ts"
import MadokaSlidebar from "@/components/MadokaSlidebar.vue"

const tokenStore = useToken()
const toAsyncComponent = <T extends Component>(comp: () => Promise<T>) => markRaw(defineAsyncComponent(comp));

defineOptions({
  name: "Setting",
})

const Setting = (() => {
  const s = reactive({
    current: 0,
    list: [
      {
        title: "主题外观",
        component: toAsyncComponent(() => import("@/components/project/setting/PreThemeSetting.vue")),
      },
      {
        title: "隐私保护",
        component: toAsyncComponent(() => import("@/components/project/setting/PreThemeSetting.vue")),
      },
      {
        title: "关于系统",
        component: toAsyncComponent(() => import("@/components/project/setting/PreThemeSetting.vue")),
      },
    ],
  })
  return s
})()

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

  width: 800px;
  height: 600px;

  .main {
    flex: 1;
  }
}

.content {
  display: flex;
  width: 800px;
  height: 550px;

  overflow: hidden;
  font-family: "PingFang SC", sans-serif;
  color: @text-main;

  // --- 右侧内容区 ---
  .main {
    flex: 1;
    // 右侧完全通透，利用 content 的毛玻璃底
    background: transparent;
    padding: 40px;
    display: flex;
    flex-direction: column;

    &__body {
      flex: 1;
      position: relative;
    }
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
