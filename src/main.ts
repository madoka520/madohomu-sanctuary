import { createApp } from 'vue'
import App from './App.vue'
import "@/assets/styles/layout.less"
import { createPinia } from "pinia";
import "@mdi/font/css/materialdesignicons.css"
import "swiper/css"
import "@/assets/styles/font.less"
if ('paintWorklet' in CSS) {
  CSS.paintWorklet.addModule(getAssetUrl('js/smooth-corners.js'))
}

const app = createApp(App)
import { GesturePlugin } from "@vueuse/gesture"
import { getAssetUrl } from '@/utils/resource.ts'
app.use(GesturePlugin)

app.use(createPinia())
app.mount('#madoka')
