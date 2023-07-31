const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const { chalk } = require('@vue/cli-shared-utils')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isDev = process.env.NODE_ENV !== 'production'

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/bard',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    port: 8024,
    open: true,
    overlay: {
      warnings: false,
      errors: false
    },
    contentBase: resolve('/static')
  },
  css: {
    loaderOptions: {
      // scss全局变量
      scss: {
        prependData: '@import "~@/styles/variables.scss";'
      }
    }
  },
  pwa: {
    name: '光之演奏家',
    themeColor: '#343838',
    msTileColor: '#343838',
    iconPaths: {
      favicon32: 'favicon.png',
      favicon16: 'favicon.png',
      appleTouchIcon: 'favicon.png',
      maskIcon: null,
      msTileImage: 'favicon.png'
    },
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    // assetsVersion
    // manifestPath
    // https://segmentfault.com/a/1190000019281388?utm_source=tag-newest
    // https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#full_generatesw_config
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      exclude: [/\.(?:html|mid|js|css|png|jpg|jpeg|svg|ttf)$/],
      runtimeCaching: [{
        urlPattern: /\.(?:html)$/,
        handler: 'NetworkFirst'
      }, {
        urlPattern: /\.(?:mid)$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'mid',
          expiration: {
            maxEntries: 60,
            maxAgeSeconds: 15 * 86400
          }
        }
      }, {
        urlPattern: /\.(?:js|css)$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'jscss',
          expiration: {
            maxEntries: 60,
            maxAgeSeconds: 15 * 86400
          }
        }
      }, {
        urlPattern: /\.(?:png|jpg|jpeg|svg|ttf|json)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'common',
          expiration: {
            maxEntries: 30,
            maxAgeSeconds: 30 * 86400
          }
        }
      }]
    },
    manifestOptions: {
      background_color: '#343838',
      description: '光之演奏家,为 FF14 而生的演奏工具',
      display: 'fullscreen', // standalone fullscreen
      lang: 'zh-CN',
      start_url: './?from=pwa',
      icons: [
        {
          src: 'favicon.png',
          sizes: '40x40',
          type: 'image/png'
        },
        {
          src: 'favicon-144.png',
          sizes: '144x144',
          type: 'image/png'
        }
      ]
    }
    // manifestCrossorigin
  },
  configureWebpack: config => {
    let plugins = []
    if (isDev) {
      // 开发环境 自定义追加打印内容
      plugins = [
        (function() {
          function PrintText() {}
          PrintText.prototype.apply = compiler => {
            compiler.plugin('done', () => {
              console.log(`  ${chalk.bgWhiteBright.blue.bold(' 光之演奏家 ')}`)
            })
          }
          return new PrintText()
        })()
      ]
    } else {
      plugins = [
        // gZip
        new CompressionWebpackPlugin({
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: /\.(js|css|json|html|ico|svg)(\?.*)?$/i,
          threshold: 10240,
          minRatio: 0.8
        })
        // 打包分析
        // new BundleAnalyzerPlugin()
      ]
      // config.externals = {
      //   vue: 'Vue',
      //   'vue-router': 'VueRouter',
      //   vuex: 'Vuex'
      // }
    }
    config.plugins = [
      ...config.plugins,
      ...plugins
    ]
  },
  chainWebpack(config) {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    config.resolve.alias
      .set('@', resolve('src'))
      .set('views', resolve('srv/views'))

    // 打包时使用cdn替换依赖
    // if (!isDev) {
    //   config.plugin('html')
    //     .tap(args => {
    //       args[0].cdn = {
    //         js: [
    //           'https://ff14-3gaz7i4cedb8328b-1304999371.tcloudbaseapp.com/cdn/vue@2.6.js',
    //           'https://ff14-3gaz7i4cedb8328b-1304999371.tcloudbaseapp.com/cdn/vue-router@3.2.js',
    //           'https://ff14-3gaz7i4cedb8328b-1304999371.tcloudbaseapp.com/cdn/vuex@3.6.js'
    //         ]
    //       }
    //       return args
    //     })
    // }

    // 去除 console
    config.optimization.minimizer('terser').tap(args => {
      args[0].terserOptions.compress.drop_console = true
      return args
    })
  }
}
