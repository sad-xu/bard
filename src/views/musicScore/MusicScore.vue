<template>
  <div>
    <!-- 当前曲目 -->
    <div class="score-header" :class="{ filter: filter || showMusicScore }">
      <span class="current-music" @click="toggleMusicScore">{{ selectedMusicName || '选择乐谱' }}</span>
      <i v-show="musicScore.length" class="iconfont icon-changpian" title="显示乐谱" @click="showPaper = !showPaper"></i>
    </div>
    <!-- 播放 / 暂停 / 重播  -->
    <div
      v-show="selectedIndex !== -1"
      class="menu-wrapper" :class="{'menu-wrapper-hidden': hideMenu, filter: filter || showMusicScore }"
      @mouseenter="hideMenu = false" @mouseleave="hideMenu = true">
      <i
        class="iconfont audio-icon"
        :class="isPlay ? 'icon-stop' : 'icon-start'"
        :title="isPlay ? '暂停' : '播放'" @click="toggleTheSong">
      </i>
      <i class="reload-icon iconfont icon-music" title="重播" @click="reloadTheSong"></i>
    </div>
    <!-- 曲目列表 -->
    <transition name="list-fade">
      <div v-show="showMusicScore" class="score-body" @scroll="handleScroll">
        <div
          v-for="(item, i) in musicList" :key="i"
          class="song" :class="{ 'selected-song': selectedIndex === i }"
          @click="handleMusicSelect(item, i)">
          {{ item.name }}
        </div>
      </div>
    </transition>
    <transition name="model-fade">
      <div v-show="showMusicScore" class="model" @click="toggleMusicScore"></div>
    </transition>
    <!-- 乐谱 -->
    <transition name="paper-fade">
      <div v-show="showPaper && musicScore.length" class="notes-wrapper" :class="{ filter: filter || showMusicScore }">
        <span
          v-for="item in musicScore" :key="item[0]"
          :class="{ 'notes-up': item[3] === '↑', 'notes-down': item[3] === '↓' }"
          class="notes" :style="`margin-left: ${item[1]}px;`">
          {{ item[2] }}
        </span>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios'
import Sound from '@/utils/Sound'
import { parseMIDI } from '@/utils/MIDI'
import Timer from '@/utils/Timer'
const sounder = new Sound()
sounder.setVolume(0.05)
// TODO: 音量调节

let scrollBodyDom = null
let childrenDoms = []
const itemHeight = 64

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
      // 陆行鸟之歌 植物大战僵尸
      musicList: Array.from({ length: 40 }).map((v, i) => ({ name: `陆行鸟之歌-${i}` })),
      // 乐谱显示
      showPaper: false,
      // 乐谱音符
      musicScore: [],
      // 1 tick 耗时 * 10  / ms
      tickTime: 16,
      // 播放状态
      isPlay: false,
      // 播放按钮显隐
      hideMenu: true
    }
  },
  computed: {
    selectedMusicName() {
      return this.selectedIndex === -1 ? '' : this.musicList[this.selectedIndex].name
    },
    showMusicScore() {
      return this.$store.getters.showMusicScore
    }
  },
  watch: {
    showMusicScore() {
      this.$nextTick(() => {
        scrollBodyDom.scrollTo({
          top: this.selectedIndex === -1 ? 1 * itemHeight : this.selectedIndex * itemHeight - scrollBodyDom.offsetHeight / 2,
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
      console.log(item, i)
      this.toggleMusicScore()
      this.selectedIndex = i
      const service = axios.create({
        baseURL: '',
        responseType: 'arraybuffer'
      })
      service({
        url: '陆行鸟之歌.mid'
        // url: `${item.name}.mid`
      }).then(res => {
        const { headerChunk, trackChunk } = parseMIDI(res.data)
        const musicScore = []
        trackChunk.forEach(chunk => {
          let t = 0
          let lastT = 0
          chunk.forEach(track => {
            lastT = t
            t += track[0]
            if (track[2] === '声音开启') {
              // 音符 N=B mod 12 余数  音阶 0=B div 12 - 1 商
              const B = track[1][0]
              const N = ['1', '1#', '2', '3b', '3', '4', '4#', '5', '5#', '6', '7b', '7'][B % 12]
              let O = Math.floor(B / 12) - 1
              if (O <= 4) O = '↓'
              else if (O >= 6) O = '↑'
              else O = ''
              if (t - lastT) {
                musicScore.push([t / 10, Number(((t - lastT) / 3).toFixed(2)), N, O])
              }
            }
          })
        })
        this.musicScore = musicScore
        // 歌曲时长 = 最后一个音符的时刻 + 3s
        console.log(musicScore[musicScore.length - 1][0] * headerChunk.tempo / headerChunk.tick / 1000 * 10 / 1000 + 3)
        // Tip: 每个 tick 约为 1.6ms，但定时器最短间隔为4ms，实际表现会慢好几倍
        // 所以将间隔时间 = tick * 10, 并且将tick数 / 10
        const tickTime = headerChunk.tempo / headerChunk.tick / 1000 * 10
        this.tickTime = tickTime
        this.initTheSong()
        this.hideMenu = false
        this.showPaper = true
      })
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
          child.style.transform = `scale3d(${n}, ${n}, 1)`
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
    &:hover {

    }
  }
  .icon-changpian {
    font-size: 24px;
    color: #ccc;
    transition: all 0.3s;
    cursor: pointer;
    &:hover {
      color: #fff;
      transform: scale(1.2);
    }
  }
}

.menu-wrapper {
  position: absolute;
  top: 4%;
  left: 30%;
  right: 30%;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.5s, filter 0.5s;
  .audio-icon {
    font-size: 46px;
    color: #5b5b5b;
    margin: 0 10px;
    transition: color 0.3s;
    cursor: pointer;
    &:hover {
      color: #bcbcbc;
    }
  }
  .reload-icon {
    font-size: 30px;
    color: #5b5b5b;
    transition: color 0.3s;
    cursor: pointer;
    &:hover {
      color: #bcbcbc;
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
  width: 200px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transform-origin: left;
  z-index: 99;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  .song {
    flex-shrink: 0;
    height: 60px;
    padding: 15px 4px;
    margin: 2px 0;
    background-color: pink;
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

.notes-wrapper {
  position: absolute;
  top: 10%;
  left: 7%;
  right: 7%;
  padding-top: 10px;
  margin-top: 20px;
  max-height: calc(90vh - 240px);
  background-color: rgba(3, 3, 3, 0.3);
  box-shadow: 0 0 8px 8px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  transition: filter 0.5s;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  .notes {
    display: inline-block;
    border-radius: 10px;
    padding: 4px 8px;
    margin-bottom: 10px;
    background-color: #b2b2b2;
    color: #333;
  }
  .notes-up {
    background-image: linear-gradient(#f3ea91, #e0651d);
    color: #eee;
  }
  .notes-down {
    background-image: linear-gradient(#7a82be, #85e9e1);
    color: #eee;
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
</style>
