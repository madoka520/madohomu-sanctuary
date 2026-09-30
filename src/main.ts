import { createApp } from 'vue'
import App from './App.vue'
import "@/assets/styles/layout.less"
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
