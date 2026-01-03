import { createApp } from 'vue'
import App from './App.vue'
import "@/assets/styles/layout.less"
import { createPinia } from "pinia";
import "@mdi/font/css/materialdesignicons.css"

const app = createApp(App)
app.use(createPinia())
app.mount('#madoka')
