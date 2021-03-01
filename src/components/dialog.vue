<template>
  <transition name="dialog-fade">
    <div v-if="visible">
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
          <i class="iconfont icon-close" @click="close"></i>
        </div>
        <div class="menu-body" :style="{ maxHeight: maxHeight }">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
// model唯一
let dialogNum = 0

export default {
  name: 'FfDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
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
    defaultBottom: {
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
    },
    // 最大高度
    maxHeight: {
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
      if (this.defaultBottom) obj.bottom = this.defaultBottom
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
.dialog-fade-enter-active { transition: opacity 0.5s; }
.dialog-fade-leave-active { transition: opacity 0.2s; }
.dialog-fade-enter,
.dialog-fade-leave-to {
  opacity: 0;
}

.menu-model {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
}

.menu {
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  width: 710px;
  max-width: 85%;
  padding: 0 12px 12px;
  margin: 0 auto;
  box-shadow: 1px 1px 5px 0 #222;
  background-color: #383838;
  color: #fff;
  border-radius: 10px;
  z-index: 10;
  .menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    margin: 0 -12px;
    padding: 12px 12px 0;
    cursor: move;
    .menu-title {
      cursor: default;
    }
    .icon-close {
      cursor: pointer;
    }
  }
  .menu-body {
    position: relative;
    max-height: calc(100% - 40px);
    margin-top: 10px;
    padding: 0 10px 10px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #686868 rgba(0, 0, 0, 0.2);
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #686868;
      border-radius: 4px;
      &:hover {
        background-color: rgba(144, 147, 153, 0.5);
      }
    }
  }
  .menu-footer {

  }
}
</style>
