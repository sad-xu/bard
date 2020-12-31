<template>
  <div>
    <canvas id="Screen" ref="Screen"></canvas>
    <keyboard-menu v-if="showKeyboardMenu"></keyboard-menu>
    <timbre-menu v-if="showTimbreMenu"></timbre-menu>
    <keyboard @sing="sing"></keyboard>
  </div>
</template>

<script>
import sounder from '@/utils/Sound'
import Keyboard from './keyboard/Keyboard'
import KeyboardMenu from './keyboardmenu/KeyboardMenu'
import TimbreMenu from './timbreMenu/TimbreMenu'
import { debounce } from '@/utils'

export default {
  name: 'Home',
  components: {
    Keyboard,
    KeyboardMenu,
    TimbreMenu
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
    }
  },
  mounted() {
    const screenDom = this.$refs.Screen
    const ctx = screenDom.getContext('2d')
    let width = screenDom.width
    let height = screenDom.height
    const analyser = sounder.analyser
    const timeArray = new Uint8Array(analyser.frequencyBinCount)
    const freqArray = new Uint8Array(analyser.frequencyBinCount)
    const barWidth = width / analyser.frequencyBinCount * 2
    // 窗口改变适应
    window.addEventListener('resize', debounce(function() {
      width = screenDom.width
      height = screenDom.height
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
#Screen {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 400px;
  transform: translate(-50%, -50%);
}
</style>
