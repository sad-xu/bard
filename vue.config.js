const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const { chalk } = require('@vue/cli-shared-utils')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isDev = process.env.NODE_ENV !== 'production'

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/',
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
    // workboxPluginMode: {}
    // workboxOptions
    name: '光之演奏家',
    themeColor: '#f00',
    msTileColor: '#0f0',
    iconPaths: {
      favicon32: 'favicon.png',
      favicon16: 'favicon.png',
      appleTouchIcon: 'favicon.png',
      // maskIcon: 'favicon.svg',
      msTileImage: 'favicon.png'
    },
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black'
    // assetsVersion
    // manifestPath
    // manifestOptions
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
              console.log(`  ${chalk.bgWhiteBright.blue.bold(' bard ')}`)
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
      config.externals = {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex'
      }
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

    if (!isDev) {
      config.plugin('html')
        .tap(args => {
          args[0].cdn = {
            js: [
              'https://cdn.jsdelivr.net/npm/vue@2.6.11',
              'https://cdn.jsdelivr.net/npm/vue-router@3.2.0',
              'https://cdn.jsdelivr.net/npm/vuex@3.6.0'
            ]
          }
          return args
        })
    }

    // 去除 console
    config.optimization.minimizer('terser').tap(args => {
      args[0].terserOptions.compress.drop_console = true
      return args
    })
  }
}
