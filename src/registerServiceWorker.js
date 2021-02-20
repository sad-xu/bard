import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered() {
      console.log('Service worker has been registered.')
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('New content is downloading.')
    },
    updated() {
      console.log('New content is available; please refresh.')
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    }
  })
}

// 监听service worker安装事件
// self.addEventListener('install', e => {
//   // 安装成功后的回调函数
//   // waitUntil：等待service worker安装完成后执行
//   // 安装完成后添加缓存并自动立即激活生效
//   e.waitUntil(
//     preCache()
//       .catch(err => {
//         console.log('install error:', err)
//       })
//       .then(self.skipWaiting)
//   )
// })
