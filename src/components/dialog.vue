<template>
  <div>
    <div v-if="showModel" class="menu-model"></div>
    <div class="menu" :style="styleObj">
      <div
        class="menu-header"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseout="handleMouseUp">
        <div class="menu-title">
          {{ title }}
        </div>
        <div class="menu-close" @click="close">
          x
        </div>
      </div>
      <div class="menu-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
// model唯一
let dialogNum = 0

export default {
  name: 'FfDialog',
  props: {
    title: {
      type: String,
      default: ''
    },
    // dom 添加到body子级
    appendToBody: {
      type: Boolean,
      default: false
    },
    // 相对顶部 10px
    defaultTop: {
      type: String,
      default: ''
    },
    defaultRight: {
      type: String,
      default: ''
    },
    defaultbottom: {
      type: String,
      default: ''
    },
    // 相对中点
    defaultLeft: {
      type: String,
      default: ''
    },
    // 默认宽度
    width: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showModel: !dialogNum,
      // 拖拽相关
      isMoving: false,
      startX: 0,
      srartY: 0,
      lastX: 0,
      lastY: 0,
      x: 0,
      y: 0
    }
  },
  computed: {
    styleObj() {
      const obj = {}
      if (this.defaultTop) obj.top = this.defaultTop
      if (this.defaultRight) obj.right = this.defaultRight
      if (this.defaultbottom) obj.bottom = this.defaultbottom
      if (this.defaultLeft) obj.left = this.defaultLeft
      return {
        transform: `translate(${this.x}px, ${this.y}px)`,
        width: this.width,
        ...obj
      }
    }
  },
  created() {
    dialogNum++
  },
  mounted() {
    if (this.appendToBody) {
      document.body.appendChild(this.$el)
    }
  },
  destroyed() {
    dialogNum--
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    handleMouseDown(e) {
      this.isMoving = true
      this.startX = e.x
      this.startY = e.y
    },
    handleMouseMove(e) {
      if (this.isMoving) {
        this.x = this.lastX + e.x - this.startX
        this.y = this.lastY + e.y - this.startY
      }
    },
    handleMouseUp(e) {
      this.isMoving = false
      this.lastX = this.x
      this.lastY = this.y
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-model {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 9;
}

.menu {
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 710px;
  // height: 430px;
  z-index: 10;
  padding: 6px;
  background-color: #383838;
  color: #fff;
  border-radius: 10px;
  .menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #bfbfbf;
    cursor: move;
    .menu-title {
      cursor: default;
    }
    .menu-close {
      cursor: default;
    }
  }
  .menu-body {
    position: relative;
    padding: 10px;
  }
  .menu-footer {

  }
}
</style>
