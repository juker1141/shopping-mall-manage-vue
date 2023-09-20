import { createApp } from 'vue'
import { createPinia } from 'pinia'

// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Base
import App from './App.vue'
import router from './router'
import './assets/main.css'

// Layout
import DashboardLayout from './components/DashboardLayout.vue'
import EmptyLayout from './components/EmptyLayout.vue'

library.add(fab, fas)

const pinia = createPinia()
const app = createApp(App)

app.component('FontAwesomeIcon', FontAwesomeIcon)
app.component('DefaultLayout', DashboardLayout)
app.component('EmptyLayout', EmptyLayout)

app.use(pinia)
app.use(router)
app.mount('#app')
