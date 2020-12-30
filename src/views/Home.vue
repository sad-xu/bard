<template>
  <div>
    <canvas id="Screen" ref="Screen"></canvas>
    <keyboard-menu v-if="showKeyboardMenu"></keyboard-menu>
    <keyboard @sing="sing"></keyboard>
  </div>
</template>

<script>
import sounder from '@/utils/Sound'
import Keyboard from './keyboard/Keyboard'
import KeyboardMenu from './keyboardmenu/KeyboardMenu'

export default {
  name: 'Home',
  components: {
    Keyboard,
    KeyboardMenu
  },
  data() {
    return {

    }
  },
  computed: {
    showKeyboardMenu() {
      return this.$store.getters.showKeyboardMenu
    }
  },
  mounted() {
    const screenDom = this.$refs.Screen
    const ctx = screenDom.getContext('2d')
    const WIDTH = screenDom.width
    const HEIGHT = screenDom.height
    const analyser = sounder.analyser
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    const barWidth = WIDTH / analyser.frequencyBinCount * 2
    // TODO: 窗口改变适应
    const draw = () => {
      // TODO: 空闲判定
      if (!sounder.singingNum) {
        // 空闲
      } else {
        analyser.getByteFrequencyData(dataArray)
        ctx.fillStyle = '#eff3f5'
        ctx.fillRect(0, 0, WIDTH, HEIGHT)
        // 时域 + 频域
        let x = 0
        dataArray.forEach(v => {
          const barHeight = v / 255 * HEIGHT
          ctx.fillStyle = '#606162'
          ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight)
          x += barWidth
        })
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
