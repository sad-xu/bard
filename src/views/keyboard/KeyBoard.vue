<template>
  <div class="keyboard">
    <div class="menu-switch" @click="openMenu">
      MENU
    </div>
    <div
      v-for="item in keyboard" :key="item.label"
      class="key">
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>

<script>

const canPlay = true

/*
  TODO:
    高八度 低八度 左右两侧变化
    样式 边框 按键动画
*/

export default {
  name: 'Keyboard',
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

      // 按住重复触发处理
      let lastKey = ''
      window.addEventListener('keyup', e => {
        lastKey = ''
      })

      // 组合键 altKey ctrlKey shiftKey metaKey
      window.addEventListener('keydown', e => {
        e.preventDefault()
        event.returnValue = ''
        if (canPlay) {
          if (lastKey === e.code) return false
          lastKey = e.code
          const note = keyMap.common[e.code] // 物理按键
          if (note) {
            const pitch = e[keyMap.higher] ? 'higher' : (e[keyMap.lower] ? 'lower' : '')
            this.$emit('sing', {
              note,
              pitch
            })
            console.log(note, pitch)
          }
          return false
        }
      })

      // 无法禁止的事件 [Shift] Ctrl (Q|N|W|T|Tab)
      window.addEventListener('beforeunload', e => {
        event.preventDefault()
        event.returnValue = null
      })
    },
    // 打开菜单
    openMenu() {
      // this.$emit('openMenu')
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
  border-right: 1px solid #000;
  .menu-switch {
    position: absolute;
    top: 0;
    right: 0;
  }
  .key {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    background-color: #f0e6ac;
    padding-bottom: 20px;
    border: 1px solid #000;
    border-right: 0;
  }
}
</style>
