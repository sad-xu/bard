<template>
  <div class="home">
    <div class="content" :class="{'content-pressed': showMusicScore}">
      <!-- bg -->
      <canvas id="Screen" ref="Screen"></canvas>
      <!-- 键盘 -->
      <keyboard @sing="sing"></keyboard>
    </div>
    <!-- 按键设置 -->
    <keyboard-menu v-if="showKeyboardMenu"></keyboard-menu>
    <!-- 音色设置 -->
    <timbre-menu v-if="showTimbreMenu"></timbre-menu>
    <!-- 乐谱选择 -->
    <music-score></music-score>
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
  },
  methods: {
    sing({ note, pitch }) {
      sounder.sing(note, pitch)
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  .content {
    height: 100%;
    transition: transform 0.5s;
  }
  .content-pressed {
    filter: blur(5px);
    transform: scale(0.9, 0.9);
  }
}

#Screen {
  position: absolute;
  width: 100%;
  bottom: 180px;
}
</style>
