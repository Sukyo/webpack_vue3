import '@babel/polyfill'
import {
  createApp
} from 'vue'
import router from '@/router'
import store from '@/router'
import App from '@/App'
createApp(App)
.use(router)
.use(store)
.mount('#app');