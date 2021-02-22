<template>
  <div class="home">
    <div
      class="content"
      :class="{
        'filter': showMusicScore || hasDialogOpended,
        'transform-scale': showMusicScore
      }">
      <!-- menu -->
      <div class="menu-wrapper">
        <i v-show="!isMobile" class="iconfont icon-keyboard" title="按键设置" @click="openKeyboardMenu"></i>
        <i v-show="!isMobile" class="iconfont icon-yinxiao" title="音色设置" @click="openTimbreMenu"></i>
        <i class="iconfont icon-question" title="使用须知" @click="openAboutUse"></i>
      </div>
      <!-- bg -->
      <div class="bg-img" :class="{ 'bg-img__mobile': isMobile }"></div>
      <!-- <canvas id="Screen" ref="Screen"></canvas> -->
      <!-- 键盘 -->
      <keyboard v-show="!isMobile" @sing="sing"></keyboard>
      <!-- 页脚 -->
      <footer class="footer">
        <p>
          Produced by <span style="color: #c7a2e8;">妙蛤种子@琥珀原</span>
        </p>
        <span :class="{'version-tip__mobile': isMobile}" style="color: #fff;">此版本为 DEMO 版，不代表最终效果</span>
        <p>
          Made with <span style="color: #e91e63;">❤</span>
        </p>
      </footer>
    </div>
    <!-- 按键设置 -->
    <keyboard-menu></keyboard-menu>
    <!-- 音色设置 -->
    <timbre-menu></timbre-menu>
    <!-- 使用须知 -->
    <about-use></about-use>
    <!-- 乐谱选择 -->
    <music-score :filter="hasDialogOpended"></music-score>
  </div>
</template>

<script>
import Sound from '@/utils/Sound'
import Keyboard from './keyboard/Keyboard'
import KeyboardMenu from './keyboardmenu/KeyboardMenu'
import TimbreMenu from './timbreMenu/TimbreMenu'
import MusicScore from './musicScore/MusicScore'
import AboutUse from './aboutUse/AboutUse'
import { debounce } from '@/utils'

const sounder = new Sound()

export default {
  name: 'Home',
  components: {
    Keyboard,
    KeyboardMenu,
    TimbreMenu,
    MusicScore,
    AboutUse
  },
  computed: {
    isMobile() {
      return this.$store.getters.isMobile
    },
    showMusicScore() {
      return this.$store.getters.showMusicScore
    },
    hasDialogOpended() {
      return this.$store.getters.showKeyboardMenu ||
        this.$store.getters.showTimbreMenu ||
        this.$store.getters.showAboutUse
    }
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
    openAboutUse() {
      this.$store.dispatch('app/toggleAboutUse')
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
    transition: transform 0.2s, filter 0.3s ease 0.25s;
    will-change: transform, filter;
    // -webkit-backface-visibility: hidden;
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

// #Screen {
//   position: absolute;
//   width: 100%;
//   bottom: 180px;
// }
.bg-img {
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
}

/* mobile */
.bg-img__mobile {
  bottom: 0;
  background-size: 100% auto;
}
.version-tip__mobile {
  position: absolute;
  bottom: 100%;
  right: 10px;
}
</style>
