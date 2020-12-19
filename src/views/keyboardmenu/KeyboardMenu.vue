<template>
  <div class="menu-model">
    <div class="menu" :style="`transform:translate(${x}px, ${y}px);`">
      <div
        class="menu-header"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseout="handleMouseUp">
        <div class="menu-title">
          标题
        </div>
        <div class="menu-close" @click="closeKeyboardMenu">
          x
        </div>
      </div>
      <div class="menu-body">
      </div>
      <div class="menu-footer">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KeyboardMenu',
  data() {
    return {
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
  methods: {
    closeKeyboardMenu() {
      this.$store.dispatch('keyboard/toggleShowKeyboardMenu')
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
  height: 430px;
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

  }
  .menu-footer {

  }
}
</style>
