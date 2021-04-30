<template>
  <div class="test-wrapper">
    <ff-button @click="handleStart">
      START
    </ff-button>
    <ff-button @click="handleStop">
      STOP
    </ff-button>
    <div id="MugBox" ref="MugBox">
      <canvas id="Mug" ref="Mug"></canvas>
    </div>
  </div>
</template>

<script>
// import Music from '@/utils/Music'
import { debounce } from '@/utils'
// Music.setZone()
// const musician = new Music()

export default {
  name: 'Test',
  data() {
    return {
      isRuning: false,
      width: 0,
      height: 0
    }
  },
  mounted() {
    this.initMug()
  },
  methods: {
    handleStart() {
      this.isRuning = true
      this.run()
    },
    handleStop() {
      this.isRuning = false
    },
    // 初始化尺寸
    initMug() {
      const MugBoxDom = this.$refs.MugBox
      const MugDom = this.$refs.Mug
      this.setWidthHeight(MugBoxDom, MugDom)
      // 窗口改变适应
      const that = this
      window.addEventListener('resize', debounce(function() {
        that.setWidthHeight(MugBoxDom, MugDom)
      }))
    },
    // run
    run() {
      const MugDom = this.$refs.Mug
      const ctx = MugDom.getContext('2d')
      const width = this.width
      const height = this.height
      // [类型, 时间, 距前一个音符按下的间隔, 音符, 高低八度, 显示1, 显示2, pitch]`
      const scoreList = [
        ['down', 0, 0, '5', '', '5', 'G', 67], ['up', 28.124999999999996, 67],
        ['down', 31.249999999999996, 31.25, '3', '', '3', 'D', 64], ['up', 46.87499999999999, 64],
        ['down', 46.87499999999999, 15.62, '5', '', '5', 'G', 67], ['up', 60.93749999999999, 67],
        ['down', 62.49999999999999, 15.63, '1', '↑', '1', 'Q', 72], ['up', 118.74999999999999, 72],
        ['down', 124.99999999999999, 62.5, '6', '', '6', 'H', 69], ['up', 153.12499999999997, 69],
        ['down', 156.24999999999997, 31.25, '1', '↑', '1', 'Q', 72], ['up', 184.37499999999997, 72], ['down', 187.49999999999997, 31.25, '5', '', '5', 'G', 67], ['up', 243.74999999999997, 67], ['down', 249.99999999999997, 62.5, '5', '', '5', 'G', 67], ['up', 278.12499999999994, 67], ['down', 281.24999999999994, 31.25, '1', '', '1', 'A', 60], ['up', 296.87499999999994, 60], ['down', 296.87499999999994, 15.63, '2', '', '2', 'S', 62], ['up', 310.93749999999994, 62], ['down', 312.49999999999994, 15.63, '3', '', '3', 'D', 64], ['up', 340.62499999999994, 64], ['down', 343.74999999999994, 31.25, '2', '', '2', 'S', 62], ['up', 359.37499999999994, 62], ['down', 359.37499999999994, 15.63, '1', '', '1', 'A', 60], ['up', 373.43749999999994, 60], ['down', 374.99999999999994, 15.63, '2', '', '2', 'S', 62], ['up', 459.37499999999994, 62], ['down', 499.99999999999994, 125, '5', '', '5', 'G', 67], ['up', 528.1249999999999, 67], ['down', 531.2499999999999, 31.25, '3', '', '3', 'D', 64], ['up', 546.8749999999999, 64], ['down', 546.8749999999999, 15.63, '5', '', '5', 'G', 67], ['up', 560.9374999999999, 67], ['down', 562.4999999999999, 15.63, '1', '↑', '1', 'Q', 72], ['up', 604.6874999999999, 72], ['down', 609.3749999999999, 46.88, '7', '', '7', 'J', 71], ['up', 623.4374999999999, 71], ['down', 624.9999999999999, 15.63, '6', '', '6', 'H', 69], ['up', 653.1249999999999, 69]
      ]
      console.log(scoreList)
      // let time = 0
      const delta = 0
      const draw = (t) => {
        // if (!time) time = t
        // delta = t - time
        // console.log(t)
        ctx.fillStyle = '#f00'
        ctx.clearRect(0, 0, width, height)
        ctx.fillRect(width * Math.random(), height * Math.random(), 40, 40)
        if (this.isRuning) {
          requestAnimationFrame(draw)
        }
      }
      draw()
    },
    // 设置宽高
    setWidthHeight(MugBoxDom, MugDom) {
      const width = MugBoxDom.clientWidth
      const height = MugBoxDom.clientHeight
      MugDom.width = width
      MugDom.height = height
      this.width = width
      this.height = height
    }
  }
}
</script>

<style lang="scss" scoped>
.test-wrapper {
  position: relative;
  height: 100vh;
  padding: 20px;
  background-color: #1c192c;
}

#MugBox {
  position: absolute;
  top: 60px;
  bottom: 160px;
  left: 200px;
  right: 200px;
  border: 1px solid #fff;
}
#Mug {

}
</style>
