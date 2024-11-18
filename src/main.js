import '@/scss/main.scss'

import { createApp, defineAsyncComponent } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

const app = createApp(App)

const SvgIcon = defineAsyncComponent(() => import('@/components/common/SvgIcon.vue'))
import 'virtual:svg-icons-register'
app.component('icon', SvgIcon)

app.use(createPinia())
app.use(router)

app.mount('#app')
