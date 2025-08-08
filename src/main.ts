import { createApp } from 'vue'
import App from './App.vue'
import "@/assets/styles/layout.less"
import { createPinia } from "pinia";

const app = createApp(App)
app.use(createPinia())
app.mount('#madoka')
