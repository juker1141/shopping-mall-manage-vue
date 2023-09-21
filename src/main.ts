import { createApp } from 'vue'
import { createPinia } from 'pinia'

// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Base
import ElementPlus from 'element-plus'
import zhLocale from 'element-plus/dist/locale/zh-tw.mjs'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import '@/assets/scss/style.scss'

library.add(fab, fas)

const pinia = createPinia()
const app = createApp(App)

app.component('FontAwesomeIcon', FontAwesomeIcon)

app.use(ElementPlus, { locale: zhLocale })
app.use(pinia)
app.use(router)
app.mount('#app')
