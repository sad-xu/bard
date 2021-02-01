<template>
  <div class="">
    <div class="">
      {{ selectedMusicName }}
    </div>
    <div>
      <div v-for="(item, i) in musicList" :key="i" @click="handleMusicSelect(item, i)">
        {{ item.name }}
      </div>
    </div>
    <div class="music-box">
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
      musicList: [
        { name: '陆行鸟之歌' },
        { name: '植物大战僵尸' }
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
        // const now = window.performance.now()
        const { headerChunk, trackChunk } = parseMIDI(res.data)
        // console.log('耗时：', window.performance.now() - now)
        // console.log(headerChunk, trackChunk)
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
        //
        this.musicScore = musicScore
        //
        // let t = 0
        // let tickIndex = 0
        // const len = musicScore.length - 1
        // Timer.init(function() {
        //   t++
        //   const item = musicScore[tickIndex]
        //   if (t >= item[0]) {
        //     console.log(musicScore[tickIndex])
        //     // sing
        //     let pitch = ''
        //     if (item[3] === '↑') pitch = 'higher'
        //     else if (item[3] === '↓') pitch = 'lower'
        //     sounder.sing(item[2], pitch)
        //     tickIndex++
        //     if (tickIndex > len) {
        //       Timer.end()
        //     }
        //   }
        // })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.music-box {
  .notes {
    display: inline-block;
    padding: 2px;
    margin: 2px 0;
    background-color: #4db6ac;
  }
}
</style>
