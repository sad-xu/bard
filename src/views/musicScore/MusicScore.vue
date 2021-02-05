<template>
  <div class="music-score">
    <!-- 当前曲目 -->
    <div class="score-header">
      <span class="current-music" @click="showMusicList = true">{{ selectedMusicName || '选择乐谱' }}</span>
      <span class="">打开乐谱</span>
    </div>
    <!-- 曲目列表 -->
    <transition name="list-fade">
      <div v-show="showMusicList" class="score-body">
        <div
          v-for="(item, i) in musicList" :key="i"
          class="song" @click="handleMusicSelect(item, i)">
          {{ item.name }}
        </div>
      </div>
    </transition>
    <transition name="model-fade">
      <div v-show="showMusicList" class="model" @click="showMusicList = false"></div>
    </transition>
    <!-- 乐谱 -->
    <div class="notes-wrapper">
      <span
        v-for="item in musicScore" :key="item[0]"
        class="notes" :style="`margin-left: ${item[1]}px;`">
        {{ item[2] + item[3] }}
      </span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Sound from '@/utils/Sound'
import { parseMIDI } from '@/utils/MIDI'
import Timer from '@/utils/Timer'

const sounder = new Sound()

export default {
  data() {
    return {
      selectedIndex: -1,
      showMusicList: false,
      musicList: [
        { name: '陆行鸟之歌' },
        { name: '植物大战僵尸' },
        { name: '11111' },
        { name: '22222' },
        { name: '222222' },
        { name: '222223' },
        { name: '222224' },
        { name: '222225' },
        { name: '222226' }
      ],
      musicScore: []
    }
  },
  computed: {
    selectedMusicName() {
      return this.selectedIndex === -1 ? '' : this.musicList[this.selectedIndex].name
    }
  },
  methods: {
    handleMusicSelect(item, i) {
      this.selectedIndex = i
      const service = axios.create({
        baseURL: '',
        responseType: 'arraybuffer'
      })
      service({
        // url: '植物大战僵尸.mid'
        url: `${item.name}.mid`
      }).then(res => {
        const { headerChunk, trackChunk } = parseMIDI(res.data)
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
    }
  }
}
</script>

<style lang="scss" scoped>
// .music-score {
//   z-index: 3;
// }

.model-fade-enter-active {
  transition: opacity 0.5s;
}
.model-fade-leave-active {
  transition: opacity 0.2s;
}
.model-fade-enter,
.model-fade-leave-to {
  opacity: 0;
}

.list-fade-enter-active {
  transition: transform 0.5s;
}
.list-fade-leave-active {
  transition: transform 0.3s;
}
.list-fade-enter,
.list-fade-leave-to {
  transform: translateX(-100%);
}

/********   */
.score-header {
  position: absolute;
  top: 5%;
  left: 5%;
  .current-music {
    padding: 4px 10px;
    background-color: #4db6ac;
    margin-right: 10px;
  }
}

.score-body {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 150px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transform-origin: left;
  z-index: 99;
  .song {
    padding: 4px 4px;
    background-color: pink;
    border-bottom: 1px solid #eee;
    &:last-of-type {
      border-bottom: 0;
    }
  }
}

.model {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 5px 10px #aca8a8;
  z-index: 9;
}

.notes-wrapper {
  .notes {
    display: inline-block;
    padding: 2px;
    margin: 2px 0;
    background-color: #4db6ac;
  }
}
</style>