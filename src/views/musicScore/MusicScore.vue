<template>
  <div>
    <!-- 当前曲目 -->
    <div class="score-header" :class="{ filter: filter || showMusicScore }">
      <span
        class="current-music" :class="{ 'current-music__mibile': isMobile }"
        @click="$store.dispatch('app/toggleMusicScore')">
        {{ selectedMusicName || '选择乐谱' }}
      </span>
      <i
        v-show="musicScore.length && !isMobile"
        class="iconfont icon-music-setting"
        title="显示乐谱" @click="showPaper = !showPaper">
      </i>
    </div>
    <!-- 播放 / 暂停 / 重播  -->
    <div
      v-show="selectedIndex !== -1"
      class="menu-wrapper" :class="{'menu-wrapper-hidden': hideMenu, filter: filter || showMusicScore, 'menu-wrapper__mobile': isMobile }">
      <i
        class="iconfont"
        :class="isPlay ? 'icon-stop' : 'icon-start'"
        :title="isPlay ? '暂停' : '播放'" @click="toggleTheSong">
      </i>
      <i class="iconfont icon-reload" title="重播" @click="reloadTheSong"></i>
    </div>
    <!-- 曲目列表 -->
    <music-list @handleMusicSelect="handleMusicSelect"></music-list>
    <!-- 乐谱 -->
    <transition name="paper-fade">
      <div
        v-show="showPaper && musicScore.length" class="paper"
        :class="{ filter: filter || showMusicScore, 'notes-wrapper__mobile': isMobile }">
        <div class="notes-wrapper">
          <div class="notes-inner-box">
            <span
              v-for="item in musicScore" :key="item[0]"
              :class="{ 'notes-up': item[3] === '↑', 'notes-down': item[3] === '↓' }"
              class="notes" :style="`margin-left: ${item[1] * zoomLevel}px;margin-bottom: ${10 * zoomLevel}px;`">
              {{ showKeycode ? item[5] : item[4] }}
            </span>
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
        <div class="tip">
          <span @click="showKeycode = !showKeycode">切换按键显示</span>
          <div class="key-tip">
            <span>高八度</span>
            <span class="notes-up">{{ compositeMap[keyMap.higher] }}</span>
            <span>低八度</span>
            <span class="notes-down">{{ compositeMap[keyMap.lower] }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Sound from '@/utils/Sound'
import { parseMIDI } from '@/utils/MIDI'
import Timer from '@/utils/Timer'
import MusicList from './MusicList'
const sounder = new Sound()
// sounder.setVolume(0.05)

const N_ARR = ['1', '1#', '2', '3b', '3', '4', '4#', '5', '5#', '6', '7b', '7']
const NN_ARR = ['1', '1♯', '2', '3♭', '3', '4', '4♯', '5', '5♯', '6', '7♭', '7']

export default {
  components: {
    MusicList
  },
  props: {
    // 虚化
    filter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedMusicName: '',
      // 乐谱显示
      showPaper: false,
      // 乐谱音符
      musicScore: [],
      // 1 tick 耗时 * 10  / ms
      tickTime: 16,
      // 播放状态
      isPlay: false,
      // 播放按钮显隐
      hideMenu: true,
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
    // selectedMusicName() {
    //   return this.selectedIndex === -1 ? '' : this.musicList[this.selectedIndex].name
    // },
    showMusicScore() {
      return this.$store.getters.showMusicScore
    },
    keyMap() {
      return this.$store.getters.keyMap
    },
    commonKeyMap() {
      const obj = {}
      const common = this.$store.getters.keyMap.common
      for (const key in common) {
        obj[common[key]] = this.toggleKeycode(key)
      }
      return obj
    }
  },
  methods: {
    handleMusicSelect(item) {
      this.selectedMusicName = item.name
      const isFullScale = this.$store.getters.isFullScale

      Timer.stop()
      this.isPlay = false

      const request = new XMLHttpRequest()
      request.open('GET', `/mids/${item.name}.mid`, true)
      request.responseType = 'arraybuffer'
      request.onload = () => {
        const { headerChunk, trackChunk } = parseMIDI(request.response)
        const musicScore = []
        // Tip: 每个 tick 约为 1.6ms，但定时器最短间隔为4ms，实际表现会慢好几倍
        // 所以将间隔时间 = tick * 10, 并且将tick数 / 10
        // 将 tick 时间缩放为20ms左右
        const tickTime = headerChunk.tempo / headerChunk.tick / 1000
        const mult = 20 / tickTime
        trackChunk.forEach(chunk => {
          let t = 0
          let lastT = 0
          chunk.forEach(track => {
            t += track[0] / mult
            if (track[2] === 'down') {
              // 音符 N=B mod 12 余数  音阶 0=B div 12 - 1 商
              const B = track[1][0]
              const N = N_ARR[B % 12]
              const NN = NN_ARR[B % 12]
              let O = Math.floor(B / 12)
              let OO = ''
              if (O <= 4) {
                O = '↓'
                OO = '-l'
              } else if (O >= 6) {
                O = '↑'
                OO = '-h'
              } else O = ''
              if (t - lastT) {
                musicScore.push([t, Number((t - lastT).toFixed(2)), N, O, NN, this.commonKeyMap[N + (isFullScale ? OO : '')] || '--'])
                lastT = t
              }
            }
          })
        })
        musicScore.sort((a, b) => a[0] - b[0])
        this.musicScore = musicScore
        console.log(headerChunk, trackChunk.map(chunk => chunk.filter(item => item[2] === 'down').map(v => v[1][0])))
        // console.log(tickTime, mult, tickTime * mult)
        this.tickTime = tickTime * mult
        this.initTheSong()
        this.hideMenu = false
        this.showPaper = true
      }
      request.send(null)
    },
    initTheSong() {
      const that = this
      let t = 0
      let tickIndex = 0
      const musicScore = this.musicScore
      const tickTime = this.tickTime
      const len = musicScore.length - 1
      Timer.end()
      Timer.init(function() {
        t++
        const item = musicScore[tickIndex]
        if (t >= item[0]) {
          let pitch = ''
          if (item[3] === '↑') pitch = 'higher'
          else if (item[3] === '↓') pitch = 'lower'
          sounder.sing(item[2], pitch)
          tickIndex++
          if (tickIndex > len) {
            Timer.end()
            that.isPlay = false
          }
        }
      }, tickTime)
    },
    toggleTheSong() {
      if (this.isPlay) {
        Timer.stop()
        this.isPlay = false
      } else {
        if (Timer.status === 'free') {
          // 播完后，再播放
          this.initTheSong()
          Timer.start()
        } else {
          Timer.start()
        }
        this.isPlay = true
      }
    },
    reloadTheSong() {
      this.isPlay = true
      this.initTheSong()
      Timer.start()
    },
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
.filter {
  filter: blur(5px);
}

//
.score-header {
  position: fixed;
  top: 4%;
  left: 2%;
  display: flex;
  align-items: center;
  // transition: filter 0.5s;
  .current-music {
    padding: 4px 10px;
    margin-right: 10px;
    border-radius: 10px;
    color: #fff;
    background-color: #716ac3;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
  .current-music__mibile {
    max-width: 120px;
  }
  .icon-music-setting {
    font-size: 24px;
    color: #fff;
    transition: all 0.3s;
    cursor: pointer;
    &:hover {
      transform: scale(1.2);
    }
  }
}

.menu-wrapper {
  position: fixed;
  top: 4%;
  right: 20%;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  transition: opacity 0.5s; //, filter 0.5s;
  .iconfont {
    font-size: 24px;
    color: #bbb;
    margin: 0 10px;
    transition: color 0.3s;
    cursor: pointer;
    &:hover {
      color: #e5e5e5;
    }
  }
}
.menu-wrapper-hidden {
  opacity: 0;
}

.paper {
  height: calc(90vh - 180px);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 10%;
  left: 7%;
  right: 7%;
  padding-top: 10px;
  // transition: filter 0.5s;
}
.notes-wrapper {
  // position: absolute;
  // top: 10%;
  // left: 7%;
  // right: 7%;
  position: relative;
  // margin-top: 20px;
  // max-height: calc(90vh - 240px);
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
    padding: 4px 8px;
    margin-bottom: 10px;
    background-color: #b2b2b2;
    color: #333;
  }
}
.notes-up {
  background-image: linear-gradient(#f3ea91, #e0651d);
  color: #eee;
}
.notes-down {
  background-image: linear-gradient(#7a82be, #85e9e1);
  color: #eee;
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
  }
  .notes-up,
  .notes-down {
    display: inline-block;
    width: 40px;
    text-align: center;
    padding: 2px 4px;
    border-radius: 10px;
    margin: 0 14px 0 6px;
    color: #474747;
  }
  .notes-down {
    margin-right: 0;
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
  .notes {
    padding: 2px 6px;
    margin-bottom: 6px;
  }
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
.menu-wrapper__mobile {
  right: 50%;
  transform: translateX(70%);
}
</style>
