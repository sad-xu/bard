import { base64ToArrayBuffer } from '@/utils'

/**
 * 乐器发声 72-83
 * 声音资源 https://surikov.github.io/webaudiofontdata/sound/0020_Aspirin_sf2_file.html
 * 音色表 https://blog.csdn.net/muyao987/article/details/106854562
 */

// 所有实例
const instanceList = []
// 所有乐器音色
const soundFontMap = {}
let currentZoneList = []

// (AudioBufferSourceNode --> gainNode) --> totalGainNode --> compressor --> destination
class Music {
  constructor() {
    const context = new (window.AudioContext || window.webkitAudioContext)()
    const totalGainNode = context.createGain()
    totalGainNode.connect(context.destination)

    this.context = context
    this.volume = 0 // 音量百分比
    this.duration = 0.6 // 声音持续时间
    this.totalGainNode = totalGainNode
    this.zoneList = currentZoneList // 当前音色
    this.singing = {} // 正在演奏的
    this.setVolume(localStorage.getItem('volume') || 0.3)
    // 保存实例
    instanceList.push(this)
  }

  // 听个响
  // 音符 48-59 60-71 72-83 84
  // 高 低 平 higher lower ''
  // 高/低 半音 high low
  sing(note) {
    if (note > 84) note = 84
    else if (note < 48) note = 48

    const context = this.context
    const bufferSourceNode = context.createBufferSource()
    const gainNode = context.createGain()
    const zone = this.zoneList.find(
      (zone) => zone.keyRangeLow <= note && zone.keyRangeHigh >= note
    )
    if (!zone) return
    bufferSourceNode.buffer = zone.buffer
    bufferSourceNode.loop = zone.loop
    if (zone.loop) {
      bufferSourceNode.loopStart = zone.loopStart / zone.sampleRate
      bufferSourceNode.loopEnd = zone.loopEnd / zone.sampleRate
    }

    bufferSourceNode.detune.value = (note - zone.keyRangeMiddle) * 100

    // 音调 通过控制播放速度调整频率
    // const baseDetune = zone.originalPitch - 100 * zone.coarseTune - zone.fineTune
    // const playbackRate = 1 * Math.pow(2, (100 * note - baseDetune) / 1200)
    // bufferSourceNode.playbackRate.value = playbackRate // 播放速度 - 频率

    bufferSourceNode.connect(gainNode)
    gainNode.connect(this.totalGainNode)

    const currentTime = context.currentTime
    bufferSourceNode.start()
    gainNode.gain.exponentialRampToValueAtTime(1, currentTime + 0.1)
    this.singing[note] = [gainNode, bufferSourceNode]
  }

  // 停止单个
  silent(note) {
    this._soundOff(note)
  }

  // 停止所有
  silentAll() {
    for (const key in this.singing) {
      // this.singing[key].forEach(item => {
      this._soundOff(key)
      // })
    }
  }

  // 静音
  _soundOff(key) {
    const currentSing = this.singing[key]
    if (currentSing) {
      const currentTime = this.context.currentTime
      currentSing[0].gain.setTargetAtTime(0.01, currentTime + 0.1, this.duration / 3)
      // currentSing[0].gain.linearRampToValueAtTime(0.01, currentTime + this.duration)
      currentSing[1].stop(currentTime + this.duration)
      delete this.singing[key]
    }
  }

  // 设置自身音量
  setVolume(percentage) {
    percentage = Number(percentage)
    if (percentage <= 0) percentage = 0.0001
    this.volume = percentage
    this.totalGainNode.gain.exponentialRampToValueAtTime(3.4 * percentage, this.context.currentTime + 1)
  }
}

/* 针对所有实例 */
// 设置总音量
Music.setAllVolume = function(percentage) {
  localStorage.setItem('volume', percentage)
  instanceList.forEach(instance => {
    instance.setVolume(percentage)
  })
}

// 设置持续时间
Music.setAllDuration = function(duration) {
  localStorage.setItem('duration', duration)
  instanceList.forEach(instance => {
    instance.duration = duration
  })
}

// 设置乐器
Music.setZone = function(name = 'ff-grandpiano') {
  localStorage.setItem('instrument', name)
  return new Promise((resolve, reject) => {
    if (soundFontMap[name]) {
      resolve(soundFontMap[name])
    } else {
      const context = instanceList.length
        ? instanceList[0].context
        : new window.AudioContext()
      const request = new XMLHttpRequest()
      request.open('GET', `/soundfonts/${name}.json`, true)
      request.responseType = 'json'
      request.onload = () => {
        const zoneList = request.response.map((z) => {
          const arraybuffer = base64ToArrayBuffer(z.file)
          const zone = {
            keyRangeLow: z.keyRangeLow,
            keyRangeMiddle: z.keyRangeMiddle,
            keyRangeHigh: z.keyRangeHigh,
            buffer: null,
            loop: z.loop,
            loopStart: z.loopStart || 0,
            loopEnd: z.loopEnd || 0,
            sampleRate: z.sampleRate || 44100
          }
          context.decodeAudioData(arraybuffer, (audioBuffer) => {
            zone.buffer = audioBuffer
          })
          return zone
        })
        soundFontMap[name] = zoneList
        resolve(zoneList)
      }
      request.onerror = () => {
        reject(new Error('zone request err!'))
      }
      request.send(null)
    }
  }).then(zoneList => {
    currentZoneList = zoneList
    instanceList.forEach(instance => {
      instance.zoneList = zoneList
    })
  })
}

// if (!localStorage.getItem('instrument')) {
//   localStorage.setItem('instrument', 'harp')
// }
// Music.setZone(localStorage.getItem('instrument'))

export default Music
