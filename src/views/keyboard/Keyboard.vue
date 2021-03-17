<template>
  <div class="keyboard-wrapper">
    <!-- 指示灯 -->
    <div class="indicator indicator-left">
      <div
        class="indicator-mask-higher"
        :class="{ 'show-indicator-mask': higherPressed }">
      </div>
      <div
        class="indicator-mask-lower"
        :class="{ 'show-indicator-mask': lowerPressed }">
      </div>
    </div>
    <div class="indicator indicator-right">
      <div
        class="indicator-mask-higher"
        :class="{ 'show-indicator-mask': higherPressed }">
      </div>
      <div
        class="indicator-mask-lower"
        :class="{ 'show-indicator-mask': lowerPressed }">
      </div>
    </div>
    <div class="keyboard">
      <!-- 按键  -->
      <div
        v-for="item in keyboard" :key="item.label" class="key"
        :class="{
          'key-pressed': pressedCodes[item.code],
          'black-key': item.type,
          'full-black-key': item.type && isFullScale
        }"
        :style="item.type ? `left: ${ 100 / (isFullScale ? 22 : 8) * item.type}%` : ''"
        @click.stop="handleKeyClick(item)">
        <span class="code" :class="{'hidden-code': !item.code}">
          {{ item.code | toggleKeycode }}
        </span>
        <span class="label">{{ item.truthLabel || item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
// ctrl shift alt
const COMPOSITE_KEYS = {
  altKey: 'Alt',
  ctrlKey: 'Control',
  shiftKey: 'Shift'
}

const partKeyboard = [
  { label: '1', code: '' },
  { label: '1#', truthLabel: '1 ♯', code: '', type: 1 },
  { label: '2', code: '' },
  { label: '3b', truthLabel: '3 ♭', code: '', type: 2 },
  { label: '3', code: '' },
  { label: '4', code: '' },
  { label: '4#', truthLabel: '4 ♯', code: '', type: 4 },
  { label: '5', code: '' },
  { label: '5#', truthLabel: '5 ♯', code: '', type: 5 },
  { label: '6', code: '' },
  { label: '7b', truthLabel: '7 ♭', code: '', type: 6 },
  { label: '7', code: '' },
  { label: 'i', code: '' }
]
const fullKeyboard = [
  { label: '1-l', truthLabel: '1', code: '' },
  { label: '1#-l', truthLabel: '1 ♯', code: '', type: 1 },
  { label: '2-l', truthLabel: '2', code: '' },
  { label: '3b-l', truthLabel: '3 ♭', code: '', type: 2 },
  { label: '3-l', truthLabel: '3', code: '' },
  { label: '4-l', truthLabel: '4', code: '' },
  { label: '4#-l', truthLabel: '4 ♯', code: '', type: 4 },
  { label: '5-l', truthLabel: '5', code: '' },
  { label: '5#-l', truthLabel: '5 ♯', code: '', type: 5 },
  { label: '6-l', truthLabel: '6', code: '' },
  { label: '7b-l', truthLabel: '7 ♭', code: '', type: 6 },
  { label: '7-l', truthLabel: '7', code: '' },

  { label: '1', code: '' },
  { label: '1#', truthLabel: '1 ♯', code: '', type: 8 },
  { label: '2', code: '' },
  { label: '3b', truthLabel: '3 ♭', code: '', type: 9 },
  { label: '3', code: '' },
  { label: '4', code: '' },
  { label: '4#', truthLabel: '4 ♯', code: '', type: 11 },
  { label: '5', code: '' },
  { label: '5#', truthLabel: '5 ♯', code: '', type: 12 },
  { label: '6', code: '' },
  { label: '7b', truthLabel: '7 ♭', code: '', type: 13 },
  { label: '7', code: '' },

  { label: '1-h', truthLabel: '1', code: '' },
  { label: '1#-h', truthLabel: '1 ♯', code: '', type: 15 },
  { label: '2-h', truthLabel: '2', code: '' },
  { label: '3b-h', truthLabel: '3 ♭', code: '', type: 16 },
  { label: '3-h', truthLabel: '3', code: '' },
  { label: '4-h', truthLabel: '4', code: '' },
  { label: '4#-h', truthLabel: '4 ♯', code: '', type: 18 },
  { label: '5-h', truthLabel: '5', code: '' },
  { label: '5#-h', truthLabel: '5 ♯', code: '', type: 19 },
  { label: '6-h', truthLabel: '6', code: '' },
  { label: '7b-h', truthLabel: '7 ♭', code: '', type: 20 },
  { label: '7-h', truthLabel: '7', code: '' },
  { label: 'i-h', truthLabel: 'i', code: '' }
]

export default {
  name: 'Keyboard',
  data() {
    return {
      // [ label 音符, code 物理按键 ]
      keyboard: this.$store.getters.isFullScale ? fullKeyboard : partKeyboard,
      higherPressed: false,
      lowerPressed: false,
      // 当前按下的键
      pressedCodes: {}
    }
  },
  computed: {
    canPlay() {
      return !this.$store.getters.showKeyboardMenu
    },
    isFullScale() {
      return this.$store.getters.isFullScale
    },
    keyMap() {
      return this.$store.getters.keyMap
    }
  },
  watch: {
    // 键位映射变化后
    'keyMap.common': {
      handler(common) {
        const obj = {}
        for (const code in common) {
          obj[common[code]] = code
        }
        const keyboard = []
        const kk = this.$store.getters.isFullScale ? fullKeyboard : partKeyboard
        kk.forEach(item => {
          keyboard.push({
            ...item,
            code: obj[item.label]
          })
        })
        this.keyboard = keyboard
      },
      immediate: true
    }
  },
  created() {
    this.bindMusicKeys()
  },
  methods: {
    // 绑定键盘按键
    bindMusicKeys() {
      window.addEventListener('keyup', e => {
        e.preventDefault()
        e.returnValue = ''
        if (this.canPlay) {
          const keyMap = this.keyMap
          // 指示器
          const { code, key } = e
          // console.log(code, key)
          if (key === COMPOSITE_KEYS[keyMap.higher]) {
            this.higherPressed = false
          } else if (key === COMPOSITE_KEYS[keyMap.lower]) {
            this.lowerPressed = false
          }
          this.$set(this.pressedCodes, code, false)
        }
      })
      // 组合键 altKey ctrlKey shiftKey metaKey
      window.addEventListener('keydown', e => {
        if (e.code === 'F12') return
        e.preventDefault()
        e.returnValue = ''
        if (this.canPlay) {
          const keyMap = this.keyMap
          const { code, key } = e
          if (this.pressedCodes[code]) return false
          // 指示器
          if (key === COMPOSITE_KEYS[keyMap.higher]) {
            this.higherPressed = true
          } else if (key === COMPOSITE_KEYS[keyMap.lower]) {
            this.lowerPressed = true
          }
          //
          const note = keyMap.common[code] // 物理按键
          if (note) {
            const pitch = e[keyMap.higher] ? 'higher' : (e[keyMap.lower] ? 'lower' : '')
            this.$emit('sing', {
              note,
              pitch
            })
            this.$set(this.pressedCodes, code, true)
            // console.log(code, note, pitch)
          }
          return false
        }
      })
      // 无法禁止的事件 [Shift] Ctrl (Q|N|W|T|Tab)
      window.addEventListener('beforeunload', e => {
        e.preventDefault()
        e.returnValue = null
      })
    },
    // 鼠标点击键盘
    handleKeyClick({ label }) {
      this.$emit('sing', {
        note: label,
        pitch: this.higherPressed ? 'higher' : (this.lowerPressed ? 'lower' : '')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.keyboard-wrapper {
  position: fixed;
  height: 160px;
  bottom: 20px;
  left: 0;
  right: 0;
}

.keyboard {
  position: absolute;
  left: 30px;
  right: 30px;
  height: 100%;
  display: flex;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  overflow: hidden;
  .key {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    background-color: #e2e1e4;
    padding-bottom: 10px;
    box-shadow: inset 0 0 2px 0 #333;
    transition: background-color 0.3s;
    &:last-of-type {
      border-right: 0;
    }
    &:hover {
      background-color: #fff;
    }
    .code {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 20px;
      font-size: 12px;
      color: #fff;
      background-color: #5a5d5a;
      border-radius: 3px;
      box-shadow: 0 0 2px 1px #5a5d5a;
    }
    .hidden-code {
      opacity: 0;
    }
    .label {
      display: flex;
      align-items: flex-end;
      font-size: 14px;
      margin-top: 4px;
      color: #856823;
    }
  }
  .key-pressed {
    background-color: #fff;
  }
  .black-key {
    height: 100px;
    position: absolute;
    top: 0;
    background-color: #333;
    width: 8%;
    transform: translateX(-50%);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    box-shadow: 0 0 10px 1px #656060;
    z-index: 2;
    &:hover {
      background-color: #515151;
    }
    .label {
      color: #e0e3da;
    }
    &.key-pressed {
      background-color: #515151;
    }
  }
  .full-black-key {
    width: 4%;
  }
}

.indicator {
  position: absolute;
  top: 5px;
  bottom: 5px;
  width: 10px;
  border-radius: 10px;
  background-color: #b2b2b2;
  overflow: hidden;
  box-shadow: 0 0 10px 0 #b2b2b2;
  > div {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 10px;
    transition: opacity 0.3s;
    transform: scaleY(0);
    opacity: 0;
  }
  .indicator-mask-higher {
    transform-origin: bottom;
    background-image: linear-gradient(#f3ea91, #e0651d);
  }
  .indicator-mask-lower {
    transform-origin: top;
    background-image: linear-gradient(#7a82be, #85e9e1);
  }
  .show-indicator-mask {
    opacity: 1;
    transform: scaleY(1);
  }
}
.indicator-left {
  left: 0;
  transform: translateX(100%);
}
.indicator-right {
  right: 0;
  transform: translateX(-100%);
}
</style>
