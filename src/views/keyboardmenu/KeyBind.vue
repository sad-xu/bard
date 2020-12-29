<template>
  <div class="key-bind">
    <span>{{ note }}</span>
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
        event.returnValue = ''
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
  .input {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 20px;
    background-color: #c7c7c7;
    color: #3a3a3a;
    user-select: none;
    input {
      width: 0;
      height: 0;
      opacity: 0;
      // visibility: hidden;
      z-index: -1;
    }
  }
  .selected {
    box-shadow: 3px 3px red;
  }
}
</style>
