import { createApp } from 'vue'
import App from './App.vue'
import "@/assets/styles/layout.less"
// =========start========== 全局粉色细滚动条,替换系统默认粗灰条
import "@/assets/styles/scrollbar.less"
// =========start========== 宝石刻面语言签名样式(全站卡片/分隔线/刻字公共类)
import "@/assets/styles/gem.less"
// ========end========
// ========end========
import { createPinia } from "pinia";
import "@mdi/font/css/materialdesignicons.css"
import "@madoka520/vue-ui/style.css"
import "swiper/css"
import "@/assets/styles/font.less"
import i18n from "@/i18n"

const app = createApp(App)
import { GesturePlugin } from "@vueuse/gesture"
import lazy from '@/directives/lazy.ts'
app.use(GesturePlugin)

app.use(createPinia())
app.use(i18n)
app.directive("lazy", lazy)
app.mount('#madoka')
