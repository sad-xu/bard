import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'normalize.css/normalize.css'
import '@/styles/index.scss'

import * as filter from '@/utils/filter.js'

import components from './components'
import './registerServiceWorker'

components.forEach(component => {
  Vue.component(component.name, component)
})

for (const key in filter) {
  Vue.filter(key, filter[key])
  Vue.prototype[key] = filter[key]
}

const IS_DEV = process.env.NODE_ENV !== 'production'
Vue.config.devtools = IS_DEV
Vue.config.silent = IS_DEV
Vue.config.productionTip = IS_DEV
Vue.config.errorHandler = (err, vm, info) => console.log(err, info)
window.addEventListener('error', e => console.log('window err:', e))
window.addEventListener('unhandledrejection', e => console.log('reject', e))

// 移除默认右键菜单
window.addEventListener('contextmenu', e => e.preventDefault())

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
