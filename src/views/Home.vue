<template>
  <div class="home">
    <div
      class="content"
      :class="{
        'filter': showMusicScore || showKeyboardMenu || showTimbreMenu,
        'transform-scale': showMusicScore
      }">
      <!-- menu -->
      <div class="menu-wrapper">
        <i class="iconfont icon-keyboard" title="按键设置" @click="openKeyboardMenu"></i>
        <i class="iconfont icon-yinxiao" title="音色设置" @click="openTimbreMenu"></i>
        <i class="iconfont icon-question" title="使用须知"></i>
      </div>
      <!-- bg -->
      <div id="bg-img"></div>
      <canvas id="Screen" ref="Screen"></canvas>
      <!-- 键盘 -->
      <keyboard @sing="sing"></keyboard>
      <!--  -->
      <footer class="footer">
        <p class="footer-left">
          Produced by <span style="color: #c7a2e8;">妙蛤种子@琥珀原</span>
        </p>
        <span style="color: #fff;">此版本为 DEMO 版，不代表最终效果</span>
        <p class="footer-right">
          Made with <span style="color: #e91e63;">❤</span>
        </p>
      </footer>
    </div>
    <!-- 按键设置 -->
    <keyboard-menu v-if="showKeyboardMenu"></keyboard-menu>
    <!-- 音色设置 -->
    <timbre-menu v-if="showTimbreMenu"></timbre-menu>
    <!-- 乐谱选择 -->
    <music-score :filter="showKeyboardMenu || showTimbreMenu"></music-score>
  </div>
</template>

<script>
import Sound from '@/utils/Sound'
import Keyboard from './keyboard/Keyboard'
import KeyboardMenu from './keyboardmenu/KeyboardMenu'
import TimbreMenu from './timbreMenu/TimbreMenu'
import MusicScore from './musicScore/MusicScore'
import { debounce } from '@/utils'

const sounder = new Sound()

export default {
  name: 'Home',
  components: {
    Keyboard,
    KeyboardMenu,
    TimbreMenu,
    MusicScore
  },
  data() {
    return {

    }
  },
  computed: {
    showKeyboardMenu() {
      return this.$store.getters.showKeyboardMenu
    },
    showTimbreMenu() {
      return this.$store.getters.showTimbreMenu
    },
    showMusicScore() {
      return this.$store.getters.showMusicScore
    }
  },
  mounted() {

  },
  methods: {
    sing({ note, pitch }) {
      sounder.sing(note, pitch)
    },
    openKeyboardMenu() {
      this.$store.dispatch('keyboard/toggleShowKeyboardMenu')
    },
    openTimbreMenu() {
      this.$store.dispatch('timbre/toggleShowTimbreMenu')
    },
    initCanvas() {
      const screenDom = this.$refs.Screen
      const ctx = screenDom.getContext('2d')
      let width = screenDom.clientWidth
      let height = screenDom.clientHeight
      screenDom.width = width
      screenDom.height = height
      const analyser = sounder.analyser
      const timeArray = new Uint8Array(analyser.frequencyBinCount)
      const freqArray = new Uint8Array(analyser.frequencyBinCount)
      const barWidth = width / analyser.frequencyBinCount * 2
      // 窗口改变适应
      window.addEventListener('resize', debounce(function() {
        width = screenDom.clientWidth
        height = screenDom.clientHeight
        screenDom.width = width
        screenDom.height = height
      }))
      const draw = () => {
        if (!sounder.singingNum) {
          // 空闲
        } else {
          ctx.fillStyle = '#eff3f5'
          // ctx.fillRect(0, 0, width, height)
          ctx.clearRect(0, 0, width, height)
          ctx.lineWidth = 1
          ctx.strokeStyle = '#f00'
          analyser.getByteFrequencyData(freqArray)
          analyser.getByteTimeDomainData(timeArray)
          let x = 0
          let y = 0
          ctx.beginPath()
          freqArray.forEach((v, i) => {
            // 频域
            const barHeight = v / 255 * height
            ctx.fillStyle = '#606162'
            ctx.fillRect(x, height - barHeight, barWidth, barHeight)
            // 时域
            y = timeArray[i] / 128 * height / 2
            if (i === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
            x += barWidth
          })
          ctx.lineTo(width, height / 2)
          ctx.stroke()
        }
        requestAnimationFrame(draw)
      }
      draw()
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  .content {
    height: 100%;
    transition: transform 0.5s, filter 0.5s;
    will-change: transform, filter;
  }
  .filter {
    filter: blur(5px);
  }
  .transform-scale {
    transform: scale(0.9, 0.9);
  }
}

.menu-wrapper {
  position: absolute;
  right: 2%;
  top: 4%;
  display: flex;
  z-index: 9;
  .iconfont {
    font-size: 24px;
    color: #ccc;
    margin-left: 10px;
    transition: all 0.3s;
    cursor: pointer;
    &:hover {
      color: #fff;
      transform: scale(1.2);
    }
  }
}

#Screen {
  position: absolute;
  width: 100%;
  bottom: 180px;
}
#bg-img {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 180px;
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(https://static.web.sdo.com/jijiamobile/pic/ff14/191010shismages/M3aprHHlg5_hV72kWPhGQLv4eM.png);
  opacity: 0.7;
}

.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  font-size: 12px;
  line-height: 12px;
  color: #ccc;
  .footer-left {
  }
  .footer-right {

  }
}
</style>
