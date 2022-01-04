<template>
  <div>
    <!-- 当前曲目 -->
    <div class="score-header" :class="{ filter: filter || showMusicScore }">
      <upload-mid @parse-upload-file="handleParseUploadFile"></upload-mid>
      <div
        class="current-music" :class="{ 'current-music__mibile': isMobile }"
        @click="$store.dispatch('app/toggleMusicScore')">
        {{ selectedMusicName || '选择乐谱' }}
      </div>
    </div>
    <!-- 播放 / 暂停 / 重播  -->
    <div
      v-show="musicScore.length"
      class="menu-wrapper" :class="{'menu-wrapper-hidden': hideMenu, filter: filter || showMusicScore, 'menu-wrapper__mobile': isMobile }">
      <div
        v-if="!isMobile" v-show="showPaper && musicScore.length"
        class="mug-button" @click="handleMugButtonClick">
        {{ isMug ? '退出' : '' }}音游模式
      </div>
      <i
        v-show="!isMug" class="iconfont"
        :class="isPlay ? 'icon-stop' : 'icon-start'"
        :title="isPlay ? '暂停' : '播放'" @click="toggleTheSong">
      </i>
      <i
        v-if="!isMobile" v-show="!isMug"
        class="iconfont icon-reload" title="重播" @click="reloadTheSong">
      </i>
    </div>
    <!-- 曲目列表 -->
    <music-list @handleMusicSelect="handleMusicSelect"></music-list>
    <!-- 乐谱 -->
    <notes-paper
      :filter="filter" :hide-tip="isMug"
      :show-paper="showPaper" :music-score="musicScore">
    </notes-paper>
    <!-- 音游 -->
    <div v-if="!isMobile" v-show="isMug" ref="MugWrapper" class="mug-wrapper"></div>
  </div>
</template>

<script>
import Music from '@/utils/Music'
import { parseMIDI } from '@/utils/MIDI'
import Timer from '@/utils/Timer'
import MusicList from './MusicList'
import UploadMid from './UploadMid'
import NotesPaper from './NotesPaper'
import MUG from '@/utils/MUG'

let mug = null
const musician = new Music()

const N_ARR = ['1', '1#', '2', '3b', '3', '4', '4#', '5', '5#', '6', '7b', '7']
const NN_ARR = ['1', '1♯', '2', '3♭', '3', '4', '4♯', '5', '5♯', '6', '7♭', '7']

export default {
  components: {
    MusicList,
    UploadMid,
    NotesPaper
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
      // 是否音游模式
      isMug: false
    }
  },
  computed: {
    isMobile() {
      return this.$store.getters.isMobile
    },
    showMusicScore() {
      return this.$store.getters.showMusicScore
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
    isPlay(v) {
      if (!v) {
        musician.silentAll()
      }
    }
  },
  methods: {
    handleMusicSelect(item) {
      this.selectedMusicName = item.name

      Timer.stop()
      this.isPlay = false

      const request = new XMLHttpRequest()
      request.open('GET', `/mids/${item.name}.mid`, true)
      request.responseType = 'arraybuffer'
      request.onload = () => {
        this.parseBinary(request.response)
      }
      request.send(null)
    },
    parseBinary(binaryData) {
      const { headerChunk, trackChunk } = parseMIDI(binaryData)
      // console.log(headerChunk, trackChunk)
      const isFullScale = this.$store.getters.isFullScale
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
            let N = N_ARR[B % 12]
            let NN = NN_ARR[B % 12]
            let O = Math.floor(B / 12)
            let OO = ''
            if (O === 4) { // low
              O = '↓'
              OO = '-l'
            } else if (O === 6) { // high
              O = '↑'
              OO = '-h'
            } else if (O === 7) { // i
              O = '↑'
              OO = '-h'
              N = 'i'
              NN = 'i'
            } else O = ''
            // if (t - lastT) {
            // [类型, 时间, 距前一个音符按下的间隔, 音符, 高低八度, 显示1, 显示2, pitch]
            musicScore.push([
              'down', t, Number((t - lastT).toFixed(2)), N, O, NN,
              this.commonKeyMap[N + (isFullScale ? OO : '')] || '--',
              B
            ])
            lastT = t
            // }
          } else if (track[2] === 'up') {
            // [类型, 时间, pitch]
            musicScore.push(['up', t, track[1][0]])
          }
        })
      })
      musicScore.sort((a, b) => a[1] - b[1])
      // console.log(musicScore)
      this.musicScore = musicScore
      this.tickTime = tickTime * mult
      this.initTheSong()
      this.hideMenu = false
      this.showPaper = true
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
        if (t >= item[1]) {
          if (item[0] === 'down') {
            musician.sing(item[7])
          } else if (item[0] === 'up') {
            musician.silent(item[2])
          }
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
    handleParseUploadFile(name, binaryData) {
      this.selectedMusicName = name
      Timer.stop()
      this.isPlay = false
      this.parseBinary(binaryData)
    },
    // 音游按钮
    handleMugButtonClick() {
      if (this.isPlay) {
        Timer.stop()
        this.isPlay = false
      }
      this.isMug = !this.isMug
      this.$nextTick(() => {
        if (this.isMug) {
          if (!mug) {
            mug = new MUG(this.$refs.MugWrapper)
          }
          mug.setScore(this.musicScore, this.$store.getters.isFullScale)
          // mug.setScore([
          //   ['down', 0, 0, '5', '', '5', 'A', 60], ['up', 28.124999999999996, 60],
          //   ['down', 31.249999999999996, 31.25, '3', '', '3', 'S', 61], ['up', 46.87499999999999, 61],
          //   ['down', 46.87499999999999, 15.62, '5', '', '5', 'D', 62], ['up', 60.93749999999999, 62],
          //   ['down', 62.49999999999999, 15.63, '1', '↑', '1', '9', 63], ['up', 118.74999999999999, 63],
          //   ['down', 124.99999999999999, 62.5, '6', '', '6', 'H', 70], ['up', 153.12499999999997, 70],
          //   ['down', 156.24999999999997, 31.25, '1', '↑', '1', 'Q', 72], ['up', 184.37499999999997, 72],
          //   ['down', 187.49999999999997, 31.25, '5', '', '5', 'G', 74], ['up', 243.74999999999997, 74],
          //   ['down', 249.99999999999997, 62.5, '5', '', '5', 'G', 76], ['up', 278.12499999999994, 76],
          //   ['down', 281.24999999999994, 31.25, '1', '', '1', 'A', 78], ['up', 296.87499999999994, 78],
          //   ['down', 296.87499999999994, 15.63, '2', '', '2', 'S', 80], ['up', 310.93749999999994, 80],
          //   ['down', 312.49999999999994, 15.63, '3', '', '3', 'D', 82], ['up', 340.62499999999994, 82],
          //   ['down', 343.74999999999994, 31.25, '2', '', '2', 'S', 50], ['up', 359.37499999999994, 50],
          //   ['down', 359.37499999999994, 15.63, '1', '', '1', 'A', 54], ['up', 373.43749999999994, 54],
          //   ['down', 374.99999999999994, 15.63, '2', '', '2', 'S', 88], ['up', 459.37499999999994, 88],
          //   ['down', 499.99999999999994, 125, '5', '', '5', 'G', 90], ['up', 528.1249999999999, 90],
          //   ['down', 531.2499999999999, 31.25, '3', '', '3', 'D', 92], ['up', 546.8749999999999, 92],
          //   ['down', 546.8749999999999, 15.63, '5', '', '5', 'G', 94], ['up', 560.9374999999999, 94],
          //   ['down', 562.4999999999999, 15.63, '1', '↑', '1', 'Q', 95], ['up', 604.6874999999999, 95],
          //   ['down', 609.3749999999999, 46.88, '7', '', '7', 'J', 94], ['up', 623.4374999999999, 94],
          //   ['down', 624.9999999999999, 15.63, '6', '', '6', 'H', 93], ['up', 653.1249999999999, 93]
          // ])
          mug.replay(() => {
            this.isMug = false
          })
        } else {
          mug.stop()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.filter {
  filter: blur(5px);
}

.score-header {
  position: fixed;
  top: 4%;
  left: 2%;
  display: flex;
  align-items: center;
  // transition: filter 0.5s;
  .current-music {
    font-size: 14px;
    padding: 4px 10px;
    margin-right: 10px;
    border-radius: 10px;
    color: #fff;
    background-color: #716ac3;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: opacity 0.3s;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
  .current-music__mibile {
    max-width: 120px;
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

.mug-button {
  position: relative;
  font-weight: bold;
  font-size: 16px;
  padding: 4px 6px;
  margin-right: 30px;
  color: #3b3b3b;
  background-image: linear-gradient(90deg, #00c0ff 0%, #ffcf00 49%, #fc4f4f 100%);
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.3s;

  /* &::after {
    content: 'New';
    position: absolute;
    right: 0;
    top: 0;
    color: #ffeb3b;
    font-size: 12px;
    transform: translate(60%, -60%);
  } */
  &:hover {
    transform: scale(1.1);
  }
}
.mug-wrapper {
  position: absolute;
  top: 10%;
  left: 30px;
  right: 30px;
  height: calc(90vh - 180px);
  pointer-events: none;
}

/* mobile */
.menu-wrapper__mobile {
  right: 45%;
  transform: translateX(70%);
}
</style>
