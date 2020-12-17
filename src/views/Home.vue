<template>
  <div>
    <div class="keyboard">
      <div
        v-for="item in keyboard" :key="item.label"
        class="key" @mousedown="play(item)">
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>

const canPlay = true

export default {
  name: 'Home',
  data() {
    return {
      keyboard: [
        { label: 'C' },
        { label: 'D' },
        { label: 'E' },
        { label: 'F' },
        { label: 'G' },
        { label: 'A' },
        { label: 'B' }
      ]
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

      // const isPressed = false
      let lastKey = ''

      // 组合键 altKey ctrlKey shiftKey metaKey
      window.addEventListener('keydown', e => {
        e.preventDefault()
        event.returnValue = ''
        if (!canPlay) return false
        if (lastKey === e.code) return false
        lastKey = e.code
        console.log('keydown', lastKey)
        const note = keyMap.common[e.code] // 物理按键
        if (note) {
          const pitch = e[keyMap.higher] ? 'higher' : (e[keyMap.lower] ? 'lower' : '')
          // sound.play(note, pitch)
          console.log(note, pitch)
        }
        return false
      })

      // 按住重复触发处理
      window.addEventListener('keyup', e => {
        lastKey = ''
      })

      // 无法禁止的事件 [Shift] Ctrl (Q|N|W|T|Tab)
      window.addEventListener('beforeunload', () => {
        event.preventDefault()
        event.returnValue = ''
      })
    },
    play() {
      console.log('play')
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
  border: 1px solid #000;
  border-right: 0;
  .key {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    background-color: #f0e6ac;
    padding-bottom: 20px;
    border-right: 1px solid #000;
  }
}
</style>
