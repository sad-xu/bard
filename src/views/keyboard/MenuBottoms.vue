<template>
  <div class="menu-bottoms">
    <div class="bottoms">
      <div class="bottom" @click="openKeyboardMenu">
        按键设置
      </div>
      <!-- TODO: timbre -->
      <div class="bottom">
        音色设置
      </div>
    </div>
    <!--  -->
    <div class="tip">
      <div :class="{ pressed: higherPressed }">
        <span>高八度</span>
        <span>{{ higherKey }}</span>
      </div>
      <div :class="{ pressed: lowerPressed }">
        <span>低八度</span>
        <span>{{ lowerKey }}</span>
      </div>
      <div>
        <span>高半音</span>
        <span>---</span>
      </div>
      <div>
        <span>低半音</span>
        <span>---</span>
      </div>
    </div>
  </div>
</template>

<script>
const KEY_MAP = {
  shiftKey: 'Shift',
  ctrlKey: 'Ctrl',
  altKey: 'Alt'
}

export default {
  name: 'MenuBottoms',
  props: {
    higherPressed: {
      type: Boolean,
      default: false
    },
    lowerPressed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    higherKey() {
      return KEY_MAP[this.$store.getters.keyMap.higher]
    },
    lowerKey() {
      return KEY_MAP[this.$store.getters.keyMap.lower]
    }
  },
  methods: {
    openKeyboardMenu() {
      this.$store.dispatch('keyboard/toggleShowKeyboardMenu')
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-bottoms {
  display: flex;
  padding: 20px;
}

.tip {
  display: flex;
  flex-direction: column;
  width: 190px;
  background: #606162; // rgba(0, 0, 0, 0.6);
  padding: 4px;
  color: #b6b6b6;
  box-shadow: 0 0 6px 6px #606162;
  font-size: 12px;
  line-height: 18px;
  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.3s;
    padding-left: 6px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    margin: 3px 0;
  }
  .pressed {
    // background-color: red;
    background: radial-gradient(circle at 0 50%, rgba(222, 143, 75, 0.5) 0%, rgba(255, 255, 255, 0) 90%);
  }
}
.bottoms {
  .bottom {
    cursor: pointer;
  }
}
</style>
