<template>
  <div>
    <!-- 当前曲目 -->
    <div class="score-header" :class="{ filter: filter || showMusicScore }">
      <span class="current-music" @click="toggleMusicScore">{{ selectedMusicName || '选择乐谱' }}</span>
      <i v-show="musicScore.length && !isMobile" class="iconfont icon-music-setting" title="显示乐谱" @click="showPaper = !showPaper"></i>
    </div>
    <!-- 播放 / 暂停 / 重播  -->
    <div
      v-show="selectedIndex !== -1"
      class="menu-wrapper" :class="{'menu-wrapper-hidden': hideMenu, filter: filter || showMusicScore }">
      <i
        class="iconfont"
        :class="isPlay ? 'icon-stop' : 'icon-start'"
        :title="isPlay ? '暂停' : '播放'" @click="toggleTheSong">
      </i>
      <i class="iconfont icon-reload" title="重播" @click="reloadTheSong"></i>
    </div>
    <!-- 曲目列表 -->
    <transition name="list-fade">
      <div v-show="showMusicScore" class="score-body" @scroll="handleScroll">
        <div v-for="i in 5" :key="`${i}-up`" class="space"></div>
        <div
          v-for="(item, i) in musicList" :key="i"
          class="song" :class="{ 'selected-song': selectedIndex === i }"
          @click="handleMusicSelect(item, i)">
          <span class="song-name">{{ item.name }}</span>
          <span class="song-auth">By: <span style="color: #3f51b5;">{{ item.auth }}</span></span>
        </div>
        <div v-for="i in 5" :key="`${i}-down`" class="space"></div>
      </div>
    </transition>
    <transition name="model-fade">
      <div v-show="showMusicScore" class="model" @click="toggleMusicScore"></div>
    </transition>
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
              class="notes" :style="`margin-left: ${item[1]}px;`">
              {{ showKeycode ? item[5] : item[4] }}
            </span>
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
const sounder = new Sound()
// sounder.setVolume(0.05)
// TODO: 音量调节

let scrollBodyDom = null
let childrenDoms = []
const itemHeight = 64

const N_ARR = ['1', '1#', '2', '3b', '3', '4', '4#', '5', '5#', '6', '7b', '7']
const NN_ARR = ['1', '1♯', '2', '3♭', '3', '4', '4♯', '5', '5♯', '6', '7♭', '7']

// const SONG_LIST = require.context('../../../public/mids', false, /\.mid$/).keys().map(v => v.slice(2, -4))
const SONG_LIST = [
  { name: 'tomorrow and tomorrow', auth: 'QWQPOI' },
  { name: '勾指起誓', auth: 'QWQPOI' },
  { name: '陆行鸟之歌', auth: 'QWQPOI' },
  { name: '植物大战僵尸', auth: 'QWQPOI' },
  { name: 'il vento doro', auth: 'QWQPOI' },
  { name: '克罗地亚狂想曲', auth: '顾长歌' },
  { name: '喀秋莎', auth: '顾长歌' },
  { name: '希望之花', auth: '66189118' },
  { name: '青鸟', auth: '66189118' },
  { name: '千本樱', auth: 'yuancho' },
  { name: '5.0蛮神 妖灵王', auth: 'zhou364394799' },
  { name: 'Deja vu 头文字D', auth: '试作型红茶' },
  { name: 'dragon song', auth: 'gohiey' },
  { name: '悠久之风', auth: '蛙石' },
  { name: '斗地主', auth: 'freeizng影子' },
  { name: '热烈的决斗者', auth: '海边的吉卜力' },
  { name: '白金ディスコ', auth: 'unjason' },
  { name: '黑人抬棺', auth: '六芒_龙' }
]

export default {
  // 虚化
  props: {
    filter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedIndex: -1,
      musicList: SONG_LIST,
      // Array.from({ length: 30 }).map((v, i) => {
      //   let name = ''
      //   const index = i % SONG_LIST.length
      //   name = SONG_LIST[index]
      //   return { name: `${name}-${i}`, source: name }
      // }),
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
    selectedMusicName() {
      return this.selectedIndex === -1 ? '' : this.musicList[this.selectedIndex].name
    },
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
  watch: {
    showMusicScore() {
      this.$nextTick(() => {
        scrollBodyDom.scrollTo({
          top: this.selectedIndex === -1 ? 5 * itemHeight : (this.selectedIndex + 5) * itemHeight - scrollBodyDom.offsetHeight / 2,
          behavior: 'smooth'
        })
      })
    }
  },
  mounted() {
    scrollBodyDom = this.$el.querySelector('.score-body')
    childrenDoms = scrollBodyDom.children
  },
  methods: {
    toggleMusicScore() {
      this.$store.dispatch('app/toggleMusicScore')
    },
    handleMusicSelect(item, i) {
      const isFullScale = this.$store.getters.isFullScale
      this.toggleMusicScore()
      this.selectedIndex = i

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
              let O = Math.floor(B / 12) - 1
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
        // console.log(headerChunk, trackChunk, musicScore)
        // console.log(tickTime, mult, tickTime * mult)
        this.tickTime = tickTime * mult
        this.initTheSong()
        this.hideMenu = false
        this.showPaper = true
      }
      request.send(null)
    },
    initTheSong() {
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
          }
        }
      }, tickTime)
    },
    toggleTheSong() {
      if (this.isPlay) {
        Timer.stop()
        this.isPlay = false
      } else {
        Timer.start()
        this.isPlay = true
      }
    },
    reloadTheSong() {
      this.isPlay = true
      this.initTheSong()
      Timer.start()
    },
    handleScroll() {
      const scrollTop = scrollBodyDom.scrollTop
      const offsetHeight = scrollBodyDom.offsetHeight
      const startIndex = Math.floor(scrollTop / itemHeight)
      const endIndex = Math.floor((scrollTop + offsetHeight) / itemHeight)
      for (let i = startIndex; i <= endIndex; i++) {
        const child = childrenDoms[i]
        if (child) {
          const n = 1 - Math.abs((child.offsetTop - scrollTop) / offsetHeight - 0.5) * 0.5
          // 不设置 scaleZ, 避免过多合成层
          child.style.transform = `scaleX(${n}) scaleY(${n})` // `scale3d(${n}, ${n}, 1)`
          child.style.opacity = n
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.model-fade-enter-active { transition: opacity 0.5s; }
.model-fade-leave-active { transition: opacity 0.2s; }
.model-fade-enter,
.model-fade-leave-to {
  opacity: 0;
}

.list-fade-enter-active { transition: transform 0.5s; }
.list-fade-leave-active { transition: transform 0.3s; }
.list-fade-enter,
.list-fade-leave-to {
  transform: translateX(-100%);
}

.filter {
  filter: blur(5px);
}

//
.score-header {
  position: absolute;
  top: 4%;
  left: 2%;
  display: flex;
  align-items: center;
  transition: filter 0.5s;
  .current-music {
    padding: 4px 10px;
    margin-right: 10px;
    border-radius: 10px;
    color: #fff;
    background-color: #716ac3;
    cursor: pointer;
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
  position: absolute;
  top: 4%;
  left: 30%;
  right: 20%;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  transition: opacity 0.5s, filter 0.5s;
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

.score-body {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  min-width: 200px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transform-origin: left;
  // transform: translateZ(0);
  z-index: 99;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  .space {
    height: 60px;
    flex-shrink: 0;
  }
  .song {
    position: relative;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    height: 65px;
    padding: 15px 10px 24px 10px;
    margin: 2px 0;
    background-color: #ecf0ff;
    border-bottom: 1px solid #eee;
    border-radius: 10px;
    transition: box-shadow 0.3s;
    cursor: pointer;
    &:hover {
      box-shadow: 0 0 20px 0 #03a9f4;
    }
    &:last-of-type {
      border-bottom: 0;
    }
    .song-name {
      color: #673ab7;
      font-weight: bold;
    }
    .song-auth {
      position: absolute;
      right: 5px;
      bottom: 5px;
      font-size: 14px;
    }
  }
  .selected-song {
    box-shadow: 0 0 20px 0 #03a9f4;
  }
}

.model {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 20px 0 #505050;
  z-index: 9;
}

.paper {
  height: calc(90vh - 180px);
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 10%;
  left: 7%;
  right: 7%;
  padding-top: 10px;
  transition: filter 0.5s;
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
  height: calc(90vh - 50px);
  .notes {
    padding: 2px 6px;
    margin-bottom: 6px;
  }
  .tip {
    margin: 0;
  }
}
</style>
