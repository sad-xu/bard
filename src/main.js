import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/styles/index.scss'

const IS_DEV = process.env.NODE_ENV !== 'production'

Vue.config.devtools = IS_DEV
Vue.config.silent = IS_DEV
Vue.config.productionTip = IS_DEV
Vue.config.errorHandler = (err, vm, info) => console.log(err, info)
window.addEventListener('error', e => console.log('window err:', e))
window.addEventListener('unhandledrejection', e => console.log('reject', e))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
