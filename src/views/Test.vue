<template>
  <div class="test-wrapper">
    <div>
      <ff-button @click="handleClickButton">
        按钮
      </ff-button>
    </div>
    <div>
      <ff-select v-model="selectedValue" :options="selectOption" @change="handleSelectChange"></ff-select>
    </div>
    <div>
      <ff-checkbox v-model="checked">
        每小节敲响震铃
      </ff-checkbox>
    </div>
    <div>
      <ff-silder v-model="silderNum" @change="handleSilderChange"></ff-silder>
    </div>
    <div class="music-box">
      <span
        v-for="item in musicScore" :key="item[0]"
        class="notes" :style="`margin-left: ${item[1]}px;`">
        {{ item[2] }}
      </span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { parseMIDI } from '@/utils/MIDI'
// import sounder from '@/utils/Sound'

export default {
  name: 'Test',
  data() {
    return {
      selectedValue: '',
      selectOption: [
        { label: 'Shift', value: 'ShiftKey' },
        { label: 'Alt', value: 'AltKey' },
        { label: 'Ctrl', value: 'CtrlKey' }
      ],
      checked: false,
      silderNum: 9,
      musicScore: []
    }
  },
  created() {
    this.selectedValue = this.selectOption[0].value
  },
  methods: {
    handleClickButton() {
      console.log('button')
      const service = axios.create({
        baseURL: '',
        responseType: 'arraybuffer'
      })
      service({
        url: '植物大战僵尸.mid'
      }).then(res => {
        const { headerChunk, trackChunk } = parseMIDI(res.data)
        console.log(headerChunk, trackChunk)
        const musicScore = []
        trackChunk.forEach(chunk => {
          let t = 0
          let lastT = 0
          chunk.forEach(track => {
            lastT = t
            t += track[0] / 1000
            if (track[2] === '声音开启') {
              // 音符 N=B mod 12 余数  音阶 0=B div 12 - 1 商
              const B = track[1][0]
              const N = ['C', '#C', 'D', '#D', 'E', 'F', '#F', 'G', '#G', 'A', '#A', 'B'][B % 12]
              let O = Math.floor(B / 12) - 1
              if (O <= 4) O = '↓'
              else if (O >= 6) O = '↑'
              else O = ''
              musicScore.push([Number(t.toFixed(2)), Number((t - lastT).toFixed(2)) * 100, `${N}${O}`])
            }
          })
        })
        this.musicScore = musicScore
        console.log(musicScore)
        // if (headerChunk.timingType === 0) {
        //   const piece = 1 // 1000 / headerChunk.tick
        //   trackChunk.forEach(track => {
        //     let t = 0
        //     let lastT = 0
        //     for (let i = 0; i < track.length; i++) {
        //       t += piece * track[i][0]
        //       if (track[i][2] === '声音开启') {
        //         console.log(t - lastT)
        //         lastT = t
        //         setTimeout(() => {
        //           sounder.sing(4)
        //         }, t)
        //       }
        //     }
        //   })
        // }
      })
    },
    handleSelectChange(item) {
      console.log('select', item)
    },
    handleSilderChange(value) {
      console.log('silder', value)
    }
    // 解析音轨
    // webworker 计时tick
    // https://aiyou.life/post/kokne79MF/
  }
}
</script>

<style lang="scss" scoped>
.test-wrapper {
  padding: 20px;
  > div {
    margin: 20px;
  }
}

.music-box {
  .notes {
    display: inline-block;
    padding: 2px;
    margin: 2px 0;
    background-color: #4db6ac;
  }
}
</style>
