<template>
  <div class="keyboard">
    <menu-bottoms
      class="menu-bottoms"
      :higher-pressed="higherPressed"
      :lower-pressed="lowerPressed">
    </menu-bottoms>
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
    <!-- 按键  -->
    <div
      v-for="item in keyboard" :key="item.label"
      class="key" :class="{ 'key-pressed': pressedCodes[item.code] }">
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>

<script>
import MenuBottoms from './MenuBottoms'

// ctrl shift alt
const COMPOSITE_KEYS = {
  altKey: 'Alt',
  ctrlKey: 'Control',
  shiftKey: 'Shift'
}

export default {
  name: 'Keyboard',
  components: {
    MenuBottoms
  },
  data() {
    return {
      // [ label 音符, code 物理按键 ]
      keyboard: [
        { label: '1', code: 'Digit1' },
        { label: '2', code: 'Digit2' },
        { label: '3', code: 'Digit3' },
        { label: '4', code: 'Digit4' },
        { label: '5', code: 'Digit5' },
        { label: '6', code: 'Digit6' },
        { label: '7', code: 'Digit7' },
        { label: 'i', code: 'Digit8' }
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
    }
  },
  created() {
    this.bindMusicKeys()
  },
  methods: {
    // 绑定键盘按键
    bindMusicKeys() {
      const keyMap = {
        higher: 'shiftKey',
        lower: 'ctrlKey',
        common: {
          Digit1: 'C',
          Digit2: 'D',
          Digit3: 'E',
          Digit4: 'F',
          Digit5: 'G',
          Digit6: 'A',
          Digit7: 'B'
        }
      }

      // 按住重复触发处理
      let lastCode = ''
      window.addEventListener('keyup', e => {
        lastCode = ''
        // 指示器
        const { code, key } = e
        if (key === COMPOSITE_KEYS[keyMap.higher]) {
          this.higherPressed = false
        } else if (key === COMPOSITE_KEYS[keyMap.lower]) {
          this.lowerPressed = false
        }
        this.pressedCodes[code] = false
      })

      // 组合键 altKey ctrlKey shiftKey metaKey
      window.addEventListener('keydown', e => {
        e.preventDefault()
        event.returnValue = ''
        if (this.canPlay) {
          const { code, key } = e
          if (lastCode === code) return false
          // 指示器
          if (key === COMPOSITE_KEYS[keyMap.higher]) {
            this.higherPressed = true
          } else if (key === COMPOSITE_KEYS[keyMap.lower]) {
            this.lowerPressed = true
          }
          //
          lastCode = code
          const note = keyMap.common[code] // 物理按键
          if (note) {
            const pitch = e[keyMap.higher] ? 'higher' : (e[keyMap.lower] ? 'lower' : '')
            this.$emit('sing', {
              note,
              pitch
            })
            this.$set(this.pressedCodes, code, true)
            console.log(code, note, pitch)
          }
          return false
        }
      })

      // 无法禁止的事件 [Shift] Ctrl (Q|N|W|T|Tab)
      window.addEventListener('beforeunload', e => {
        event.preventDefault()
        event.returnValue = null
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.keyboard {
  position: fixed;
  bottom: 20px;
  left: 5%;
  right: 5%;
  display: flex;
  height: 200px;
  .key {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    background-color: #f3e9be;
    padding-bottom: 20px;
    border: 1px solid #000;
    border-right: 0;
    &:last-of-type {
      border-right: 1px solid #000;
    }
  }
  .key-pressed {
    background-color: #ffd;
  }
}

.menu-bottoms {
  position: absolute;
  top: 0;
  right: 0;
  transform: translateY(-100%);
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
  transform: translateX(-100%);
}
.indicator-right {
  right: 0;
  transform: translateX(100%);
}
</style>
