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
        v-for="item in keyboard" :key="item.label"
        class="key" :class="{ 'key-pressed': pressedCodes[item.code], 'black-key': item.type }"
        :style="item.type ? `left: ${12.5 * item.type}%` : ''">
        <span class="code">{{ item.code | toggleKeycode }}</span>
        <span class="label">{{ item.label }}</span>
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

export default {
  name: 'Keyboard',
  data() {
    return {
      // [ label 音符, code 物理按键 ]
      keyboard: [
        { label: '1', code: '' },
        { label: '1#', code: '', type: 1 },
        { label: '2', code: '' },
        { label: '3b', code: '', type: 2 },
        { label: '3', code: '' },
        { label: '4', code: '' },
        { label: '4#', code: '', type: 4 },
        { label: '5', code: '' },
        { label: '5#', code: '', type: 5 },
        { label: '6', code: '' },
        { label: '7b', code: '', type: 6 },
        { label: '7', code: '' },
        { label: 'i', code: '' }
      ],
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
        this.keyboard.forEach(item => {
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
      // window.addEventListener('beforeunload', e => {
      //   e.preventDefault()
      //   e.returnValue = null
      // })
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
    background-color: #e0e3da;
    padding-bottom: 10px;
    box-shadow: inset 0 0 2px 0 #333;
    transition: background-color 0.3s;
    &:last-of-type {
      border-right: 0;
    }
    .code {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 24px;
      height: 24px;
      font-size: 12px;
      color: #fff;
      background-color: #5a5d5a;
      border-radius: 3px;
      box-shadow: 0 0 2px 1px #5a5d5a;
    }
    .label {
      display: flex;
      align-items: flex-end;
      font-size: 14px;
      margin-top: 10px;
      color: #856823;
    }
  }
  .key-pressed {
    background-color: #fff;
  }
  .black-key {
    height: 90px;
    position: absolute;
    top: 0;
    background-color: #333;
    width: 8%;
    transform: translateX(-50%);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    box-shadow: 0 0 10px 1px #656060;
    .code {

    }
    .label {
      color: #e0e3da;
    }
    &.key-pressed {
      background-color: #7a7a7a;
    }
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
  > div {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 10px;
    transition: transform 0.3s;
    transform: scaleY(0);
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
