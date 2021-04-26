/**
 * 乐器发声 72-83
 * 声音资源 https://surikov.github.io/webaudiofontdata/sound/0020_Aspirin_sf2_file.html
 * 音色表 https://blog.csdn.net/muyao987/article/details/106854562
 */

// 所有实例
const instanceList = []
// 所有乐器音色
const soundFontMap = {}

// (AudioBufferSourceNode --> gainNode) --> totalGainNode --> compressor --> destination
class Music {
  constructor() {
    const context = new (window.AudioContext || window.webkitAudioContext)()
    const totalGainNode = context.createGain()
    const compressor = context.createDynamicsCompressor()

    totalGainNode.connect(compressor)
    compressor.connect(context.destination)

    this.context = context
    this.volume = 0 // 音量百分比
    this.duration = 0.5 // 声音持续时间
    this.totalGainNode = totalGainNode
    this.zone = [] // 当前音色列表
    this.singing = {} // 正在演奏的
    this.setVolume(localStorage.getItem('volume') || 0.3)
    // 保存实例
    instanceList.push(this)
  }

  // 听个响
  // 音符 62-71 72-83 84-95
  // 高 低 平 higher lower ''
  // 高/低 半音 high low
  sing(note, pitch, semitone) {
    const context = this.context
    const bufferSourceNode = context.createBufferSource()
    const gainNode = context.createGain()
    const zone = this.zone
    bufferSourceNode.buffer = zone.buffer
    bufferSourceNode.loop = true
    bufferSourceNode.loopStart = zone.loopStart / zone.sampleRate
    bufferSourceNode.loopEnd = zone.loopEnd / zone.sampleRate

    // 音调 通过控制播放速度调整频率
    const baseDetune = zone.originalPitch - 100 * zone.coarseTune - zone.fineTune
    const playbackRate = 1 * Math.pow(2, (100 * note - baseDetune) / 1200)
    bufferSourceNode.playbackRate.value = playbackRate // 播放速度 - 频率

    // 半音 + 八度
    let detune = 0
    if (pitch === 'higher') detune += 1200
    else if (pitch === 'lower') detune -= 1200
    if (semitone === 'high') detune += 100
    else if (semitone === 'low') detune -= 100
    bufferSourceNode.detune.value = detune // ±100 半音 ±1200 八度

    bufferSourceNode.connect(gainNode)
    gainNode.connect(this.totalGainNode)

    const currentTime = context.currentTime
    bufferSourceNode.start()
    gainNode.gain.exponentialRampToValueAtTime(1, currentTime + 0.1)
    this.singing[`${note}${pitch}${semitone}`] = [gainNode, bufferSourceNode]
    // gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + this.duration)
    // bufferSourceNode.stop(currentTime + this.duration)
  }

  // 停止单个
  silent(note, pitch, semitone) {
    this._soundOff(`${note}${pitch}${semitone}`)
  }

  // 停止所有
  silentAll() {
    for (const key in this.singing) {
      this._soundOff(key)
    }
  }

  // 静音
  _soundOff(key) {
    if (this.singing[key]) {
      const currentTime = this.context.currentTime
      // this.singing[key][0].gain.linearRampToValueAtTime(0.01, currentTime + this.duration)
      // this.singing[key][0].gain.setTargetAtTime(0.01, currentTime, 0.2)
      this.singing[key][0].gain.linearRampToValueAtTime(0.01, currentTime + this.duration)
      this.singing[key][1].stop(currentTime + this.duration)
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
  instanceList.forEach(instance => {
    instance.duration = duration
  })
}

// 设置乐器
Music.setZone = function(name = 'piano') {
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
        const zone = request.response
        const len = zone.file.length
        const arraybuffer = new ArrayBuffer(len)
        const view = new Uint8Array(arraybuffer)
        const decoded = atob(zone.file)
        for (let i = 0; i < decoded.length; i++) {
          view[i] = decoded.charCodeAt(i)
        }
        context.decodeAudioData(arraybuffer, audioBuffer => {
          zone.buffer = audioBuffer
        })
        zone.loopStart = zone.loopStart || 0
        zone.loopEnd = zone.loopEnd || 0
        zone.coarseTune = zone.coarseTune || 0
        zone.fineTune = zone.fineTune || 0
        zone.originalPitch = zone.originalPitch || 6000
        zone.sampleRate = zone.sampleRate || 44100
        resolve(zone)
      }
      request.onerror = () => {
        reject(new Error('zone request err!'))
      }
      request.send(null)
    }
  }).then(zone => {
    instanceList.forEach(instance => {
      instance.zone = zone
    })
  })
}

export default Music
