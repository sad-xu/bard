<template>
  <transition name="paper-fade">
    <div
      v-show="showPaper && musicScore.length" class="paper"
      :class="{ filter: filter || showMusicScore, 'notes-wrapper__mobile': isMobile }">
      <div class="notes-wrapper">
        <div class="notes-inner-box">
          <template v-for="item in musicScore">
            <span
              v-if="item[0] === 'down'" :key="item[1]"
              :class="{ 'notes-up': item[4] === '↑', 'notes-down': item[4] === '↓' }"
              class="notes" :style="`margin-left: ${item[2] * zoomLevel}px;margin-bottom: ${10 * zoomLevel}px;`">
              {{ showKeycode ? item[6] : item[5] }}
            </span>
          </template>
        </div>
      </div>
      <div class="zoom-wrapper" :class="{ 'zoom-wrapper__mobile': isMobile }">
        <div @click="handleZoomIn">
          +
        </div>
        <div @click="handleZoomOut">
          -
        </div>
      </div>
      <div v-show="!hideTip" class="tip">
        <span @click="showKeycode = !showKeycode">切换按键显示</span>
        <div class="key-tip">
          <span>高八度</span>
          <span class="notes-up">{{ compositeMap[keyMap.higher] }}</span>
          <span>低八度</span>
          <span class="notes-down">{{ compositeMap[keyMap.lower] }}</span>
          <span v-if="keyMap.highSemitone.label">高半音</span>
          <span v-if="keyMap.highSemitone.label" class="semitione-high">{{ keyMap.highSemitone.label }}</span>
          <span v-if="keyMap.lowSemitone.label">低半音</span>
          <span v-if="keyMap.lowSemitone.label" class="semitione-low">{{ keyMap.lowSemitone.label }}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    musicScore: {
      type: Array,
      default: () => []
    },
    filter: {
      type: Boolean,
      default: false
    },
    showPaper: {
      type: Boolean,
      required: true
    },
    hideTip: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 间距缩放 (0,2]
      zoomLevel: 1,
      // 切换按键显示 音符 / 按键
      showKeycode: true,
      compositeMap: {
        altKey: 'Alt',
        ctrlKey: 'Ctrl',
        shiftKey: 'Shift'
      }
    }
  },
  computed: {
    isMobile() {
      return this.$store.getters.isMobile
    },
    keyMap() {
      return this.$store.getters.keyMap
    }
  },
  methods: {
    // 放大
    handleZoomIn() {
      this.zoomLevel = Math.min(2, this.zoomLevel + 0.2)
    },
    // 缩小
    handleZoomOut() {
      this.zoomLevel = Math.max(0.1, this.zoomLevel - 0.2)
    }
  }
}
</script>

<style lang="scss" scoped>
.paper {
  height: calc(90vh - 180px);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 10%;
  left: 7%;
  right: 7%;
  padding-top: 10px;
}
.notes-wrapper {
  position: relative;
  height: 100%;
  background-color: rgba(3, 3, 3, 0.3);
  box-shadow: 0 0 8px 8px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  backdrop-filter: blur(3px);
  overflow: hidden;
  // -webkit-backface-visibility: hidden;
  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    box-shadow: 0 0 12px 8px rgb(50, 50, 50);
  }
  &::before { top: 0; }
  &::after { bottom: 0; }
  .notes-inner-box {
    height: 100%;
    padding-top: 10px;
    overflow-y: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
  .notes {
    display: inline-block;
    border-radius: 10px;
    margin-bottom: 10px;
    background-color: #b2b2b2;
    color: #333;
    width: 26px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    font-size: 15px;
  }
}
.notes-up {
  background-image: linear-gradient(#f3ea91, #e0651d);
}
.notes-down {
  background-image: linear-gradient(#7a82be, #85e9e1);
}
.semitione-high {
  background-color: #eee;
}
.semitione-low {
  background-color: #eee;
}

.zoom-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  right: -20px;
  transform: translateX(100%);
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  > div {
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    &:hover {
      opacity: 0.8;
    }
  }
}

.tip {
  padding-top: 8px;
  margin: 0 -5%;
  flex-shrink: 0;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #eee;
  .key-tip {
    display: flex;
    align-items: center;
    .notes-up,
    .notes-down,
    .semitione-high,
    .semitione-low {
      display: inline-block;
      min-width: 40px;
      text-align: center;
      padding: 2px 4px;
      border-radius: 10px;
      margin: 0 14px 0 6px;
      color: #474747;
    }
    & :last-child {
      margin-right: 0;
    }
  }
}

.paper-fade-enter-active,
.paper-fade-leave-active {
  transition: opacity 0.5s;
}
.paper-fade-enter,
.paper-fade-leave-to {
  opacity: 0;
}

/* mobile */
.notes-wrapper__mobile {
  left: 2%;
  right: 2%;
  height: calc(90vh - 30px);
  .tip {
    margin: 0;
    .key-tip {
      display: none;
    }
  }
}

.zoom-wrapper__mobile {
  flex-direction: initial;
  right: 10px;
  bottom: 7px;
  transform: translateX(0);
}

</style>
