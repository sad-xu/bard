<template>
  <div class="key-bind">
    <span>{{ truthNote || note }}</span>
    <span
      class="input"
      :class="isSelected ? 'selected' : ''"
      @click="handleLeftclick"
      @contextmenu="handleRightclick">
      {{ label }}
      <input
        ref="Input" type="password"
        @keydown="handleKeydown" @blur="handleBlur">
    </span>
  </div>
</template>

<script>
/**
 * 按键绑定
 * note 音符
 * truthNote 真实音符显示
 * label 绑定按键名
 *
 * @changeBind
 */
// import Clickoutside from '@/directives/clickoutside'

export default {
  name: 'KeyBind',
  // directives: { Clickoutside },
  props: {
    note: {
      type: String,
      required: true
    },
    truthNote: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isSelected: false
    }
  },
  methods: {
    // handleClickoutside() {
    //   console.log('clickoutside')
    //   this.isSelected = false
    // },
    // 鼠标左键
    handleLeftclick(e) {
      if (!this.isSelected) {
        this.$refs.Input.focus()
        this.isSelected = true
      }
    },
    // 鼠标右键
    handleRightclick() {
      if (this.isSelected) {
        this.$emit('changeBind', '')
      }
      // this.isSelected = false
    },
    handleKeydown(e) {
      if (this.isSelected) {
        this.$emit('changeBind', e.code)
        e.preventDefault()
        e.returnValue = ''
      }
    },
    handleBlur(e) {
      setTimeout(() => {
        this.isSelected = false
      }, 100)
    }
  }
}
</script>

<style lang="scss" scoped>
.key-bind {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  &:last-of-type {
    margin-bottom: 0;
  }
  .input {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 20px;
    color: #000;
    border-radius: 6px;
    background-color: #c7c7c7;
    box-shadow: inset 0 0 4px 0 #171717;
    transition: box-shadow 0.3s;
    cursor: pointer;
    user-select: none;
    input {
      width: 0;
      height: 0;
      opacity: 0;
      z-index: -1;
    }
  }
  .selected {
    box-shadow: inset 0 0 10px 4px #f3f3f3;
  }
}
</style>
