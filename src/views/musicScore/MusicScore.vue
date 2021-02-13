<template>
  <div>
    <!-- 当前曲目 -->
    <div class="score-header" :class="{ filter: filter }">
      <span class="current-music" @click="toggleMusicScore">{{ selectedMusicName || '选择乐谱' }}</span>
      <span v-show="musicScore.length" class="music-paper" @click="showPaper = !showPaper">📄</span>
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
      <div v-show="showPaper && musicScore.length" class="notes-wrapper" :class="{ filter: filter }">
        <span
          v-for="item in musicScore" :key="item[0]"
          :class="{ 'notes-up': item[3] === '↑', 'notes-down': item[3] === '↓' }"
          class="notes" :style="`margin-left: ${item[1]}px;`">
          {{ item[2] + item[3] }}
        </span>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios'
// import Sound from '@/utils/Sound'
import { parseMIDI } from '@/utils/MIDI'
// import Timer from '@/utils/Timer'
// const sounder = new Sound()

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
      musicScore: []
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
      this.showPaper = true
      const service = axios.create({
        baseURL: '',
        responseType: 'arraybuffer'
      })
      service({
        url: '陆行鸟之歌.mid'
        // url: `${item.name}.mid`
      }).then(res => {
        // headerChunk
        const { trackChunk } = parseMIDI(res.data)
        const musicScore = []
        trackChunk.forEach(chunk => {
          let t = 0
          let lastT = 0
          chunk.forEach(track => {
            lastT = t
            t += track[0] / 500
            if (track[2] === '声音开启') {
              // 音符 N=B mod 12 余数  音阶 0=B div 12 - 1 商
              const B = track[1][0]
              const N = ['1', '1#', '2', '3b', '3', '4', '4#', '5', '5#', '6', '7b', '7'][B % 12]
              let O = Math.floor(B / 12) - 1
              if (O <= 4) O = '↓'
              else if (O >= 6) O = '↑'
              else O = ''
              if (t - lastT) {
                musicScore.push([Number(t.toFixed(2) * 1000 / 40), Number((t - lastT).toFixed(2)) * 100, N, O])
              }
            }
          })
        })
        this.musicScore = musicScore
        //
        // let t = 0
        // let tickIndex = 0
        // const len = musicScore.length - 1
        // Timer.init(function() {
        //   t++
        //   const item = musicScore[tickIndex]
        //   if (t >= item[0]) {
        //     let pitch = ''
        //     if (item[3] === '↑') pitch = 'higher'
        //     else if (item[3] === '↓') pitch = 'lower'
        //     sounder.sing(item[2], pitch)
        //     tickIndex++
        //     if (tickIndex > len) {
        //       Timer.end()
        //     }
        //   }
        // }, headerChunk.tempo / headerChunk.tick / 1000 * 4) // ??
      })
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
  .music-paper {
    cursor: pointer;
  }
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
  max-height: calc(90vh - 220px);
  background-color: rgba(3, 3, 3, 0.3);
  box-shadow: 0 0 8px 8px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  transition: filter 0.5s;
  overflow-y: auto;
  .notes {
    display: inline-block;
    padding: 2px;
    border-radius: 10px;
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
