<template>
  <!-- v-clickoutside="handleClickoutside" -->
  <div
    class="key-bind"
    @mousedown="handleMousedown"
    @keydown="handleKeydown">
    <span>{{ note }}</span>
    <span class="input" :class="isSelected ? 'selected' : ''">
      {{ label }}
      <!-- TODO:  -->
      <!-- <input > -->
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
    handleMousedown(e) {
      if (e.button === 0) {
        // 左键
        this.isSelected = true
      } else if (e.button === 2) {
        // 右键
        this.$emit('changeBind', '')
      }
    },
    handleKeydown(e) {
      console.log('2', e)
      if (this.isSelected) {
        this.$emit('changeBind', e.code)
        e.preventDefault()
        event.returnValue = ''
      }
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
  }
  .selected {
    box-shadow: 3px 3px red;
  }
}
</style>
