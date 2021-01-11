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
      silderNum: 9
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
</style>
