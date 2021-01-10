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
// const MIDI = require('midi-player-js')

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
        this.customInitMIDI(res.data)
        // this.initMIDI(res.data)
      })
    },
    handleSelectChange(item) {
      console.log('select', item)
    },
    handleSilderChange(value) {
      console.log('silder', value)
    },
    initMIDI(arrayBuffer) {
      const Player = new MIDI.Player(function(event) {
        console.log(event)
      })
      // Player.on('midiEvent', tick => {
      //   console.log('tick', tick)
      // })
      Player.loadArrayBuffer(arrayBuffer)
      // Player.play()
      // setTimeout(() => {
      //   Player.pause()
      // }, 3000)
    },
    customInitMIDI(arrayBuffer) {
      const buffer = new Uint8Array(arrayBuffer)
      // tempto = 120
      // 文件头块 <标志符串>(4字节) + <头块数据区长度>(4字节) + <头块数据区>(6字节) ff ff nn nn dd dd
      // MIDI 文件格式 00 单音轨 01 多个同步音轨 10 多个独立音轨
      const format = this.bytesToNumber(buffer.subarray(8, 10))
      // 一个四分音符的ticks
      const division = this.bytesToNumber(buffer.subarray(12, 14))
      // 音轨 <标志符串>(4字节) + <音轨块数据区长度>(4字节) + <音轨块数据区>(多个MIDI事件构成)
      let tracks = []
      let i = 14
      while (i < buffer.length) {
        const trackLen = this.bytesToNumber(buffer.subarray(i + 4, i + 8))
        if (buffer.subarray(i, i + 4).join('') === '7784114107') { // MTrk
          const track = buffer.subarray(i + 8, i + 8 + trackLen)
          const len = track.length
          // <delta time> + <MIDI 消息>
          if (!(track[len - 3] === 0xff && track[len - 2] === 0x2f && track[len - 1] === 0x00)) {
            throw new Error('track 结尾格式错误')
          } else tracks.push(track)
        }
        i += trackLen + 8
      }
      let midiChunksByteLength = 14
      tracks.forEach(track => {
        midiChunksByteLength += 8 + track.length
      })
      console.log(tracks, midiChunksByteLength)
      tracks = this.parseTricks(tracks)
      console.log(tracks)
    },
    // 解析音轨
    // webworker 计时tick
    // https://aiyou.life/post/kokne79MF/
    parseTricks(tracks) {
      const list = []
      tracks.forEach(track => {
        const arr = []
        const len = track.length
        for (let i = 0; i < len; i++) {
          const start = i
          while (track[i] >= 128) {
            i++
          }
          i++
          const item = [track.subarray(start, i)]
          const stat = track[i]

          if (stat === 0xff) {
            console.log('0xff', track[i + 1])
            if (track[i + 1] === 0x00) {
              item.push(track.subarray(i + 2, i + 4))
              item.push('设置轨道音序')
              i += 4
            } else {
              i += 2
              const j = i
              while (track[i] >= 128) {
                i++
              }
              i++
              item.push(track.subarray(j, i))
              item.push('其他信息')
            }
          } else if (stat === 0xf0) {
            // Sysex
            console.log('0xf0')
          } else if (stat === 0xf7) {
            // Sysex escape
            console.log('0xf7')
          } else if (stat <= 0x8f) {
            item.push(track.subarray(i + 1, i + 3))
            item.push('松开音符')
            i += 3
          } else if (stat <= 0x9f) {
            item.push(track.subarray(i + 1, i + 3))
            item.push('按下音符')
            i += 3
          } else if (stat <= 0xAf) {
            item.push(track.subarray(i + 1, i + 3))
            item.push('触后音符')
            i += 3
          } else if (stat <= 0xBf) {
            item.push(track.subarray(i + 1, i + 3))
            item.push('控制器')
            i += 3
          } else if (stat <= 0xCf) {
            item.push(track.subarray(i + 1, i + 2))
            item.push('改变乐器')
            i += 2
          } else if (stat <= 0xDf) {
            item.push(track.subarray(i + 1, i + 2))
            item.push('触后通道')
            i += 2
          } else if (stat <= 0xEf) {
            item.push(track.subarray(i + 1, i + 3))
            item.push('滑音')
            i += 3
          }
          arr.push(item)
        }
        list.push(arr)
      })
      return list
    },
    bytesToNumber(byteArray) {
      return parseInt(this.bytesToHex(byteArray), 16)
    },
    bytesToHex(byteArray) {
      const hex = []
      byteArray.forEach(byte => {
        hex.push(('0' + byte.toString(16)).slice(-2))
      })
      return hex.join('')
    }
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
