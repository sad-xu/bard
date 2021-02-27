
// c5 - b5
const NOTE_MAP = {
  '1-h': 1046.502,
  1: 523.251,
  '1-l': 261.626,

  '1#-h': 1108.731,
  '1#': 554.365,
  '1#-l': 277.183,

  '2-h': 1174.659,
  2: 587.330,
  '2-l': 293.665,

  '3b-h': 1244.508,
  '3b': 622.254,
  '3b-l': 311.127,

  '3-h': 1318.510,
  3: 659.255,
  '3-l': 329.628,

  '4-h': 1396.913,
  4: 698.456,
  '4-l': 349.228,

  '4#-h': 1479.978,
  '4#': 739.989,
  '4#-l': 369.994,

  '5-h': 1567.982,
  5: 783.991,
  '5-l': 391.995,

  '5#-h': 1661.219,
  '5#': 830.609,
  '5#-l': 415.305,

  '6-h': 1760.000,
  6: 880.000,
  '6-l': 440.000,

  '7b-h': 1864.655,
  '7b': 932.328,
  '7b-l': 493.883,

  '7-h': 1975.533,
  7: 987.767,
  '7-l': 493.883,

  i: 2093
}

// (oscillator --> gainNode) --> totalGainNode --> ( filter... ) --> analyser --> destination
class Sound {
  constructor() {
    const context = new (window.AudioContext || window.webkitAudioContext)()
    const analyser = context.createAnalyser()
    const totalGainNode = context.createGain()
    const compressor = context.createDynamicsCompressor()
    // compressor.threshold.setValueAtTime(-50, context.currentTime)
    // compressor.knee.setValueAtTime(40, context.currentTime)
    // compressor.ratio.setValueAtTime(12, context.currentTime)
    // compressor.attack.setValueAtTime(0, context.currentTime)
    // compressor.release.setValueAtTime(0.25, context.currentTime)
    totalGainNode.gain.setValueAtTime(0.4, context.currentTime)
    analyser.fftSize = 1024
    totalGainNode.connect(analyser)
    analyser.connect(compressor)
    compressor.connect(context.destination)
    this.context = context
    this.totalGainNode = totalGainNode
    this.analyser = analyser
    this.singingNum = 0 // 正在发声的发声器数量
    //
    this.wave = 'sine' // 声源波形
    this.linkedList = [totalGainNode, analyser] // 维护当前节点链
  }

  // 听个响
  // 音调 A-G
  // 高 低 平 higher lower ''
  // https://blog.szynalski.com/2014/04/web-audio-api/
  sing(note, pitch) {
    this.singingNum++
    const context = this.context
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()
    oscillator.type = this.wave
    oscillator.connect(gainNode)
    gainNode.connect(this.totalGainNode)
    // 试图结束后手动断开连接，结果内存没变，每次调用反而多了一个事件监听 --> gainNode 也会自动断开并回收
    // oscillator.onended = () => {
    //   gainNode.disconnect(this.totalGainNode)
    // }
    let mul = 1 // 高频 * 2  低频 / 2
    if (pitch === 'higher') mul = 2
    else if (pitch === 'lower') mul = 0.5
    oscillator.frequency.value = NOTE_MAP[note] * mul
    //
    const currentTime = this.context.currentTime
    oscillator.start()
    gainNode.gain.exponentialRampToValueAtTime(1, currentTime + 0.1)
    gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 1.5)
    oscillator.stop(currentTime + 1.5)
    setTimeout(() => {
      this.singingNum--
    }, 2000)
  }

  // 设置总音量
  setVolume(percentage) {
    this.totalGainNode.gain.setValueAtTime(3.4 * percentage, this.context.currentTime)
  }

  // 设置音色 [{ type, params }]
  setTimbre(configList) {
    const nodeList = []
    configList.forEach(({ type, params }) => {
      switch (type) {
        case 'OscillatorNode': { // 音源
          if (params.type === 'custom') {
            // TODO: 自定义波形
          } else {
            this.wave = params.type
          }
          break
        }
        case 'BiquadFilterNode': { // 过滤器
          const biquadFilter = this.context.createBiquadFilter()
          const currentTime = this.context.currentTime
          const { type, frequency, gain } = params
          biquadFilter.type = type
          biquadFilter.frequency.setValueAtTime(frequency, currentTime)
          biquadFilter.gain.setValueAtTime(gain, currentTime)
          nodeList.push(biquadFilter)
          break
        }
      }
    })
    const linkedList = this.linkedList
    const len = linkedList.length
    if (linkedList.length > 2) {
      // 断开已有链接
      linkedList[0].disconnect(linkedList[1])
      linkedList[len - 2].disconnect(linkedList[len - 1])
    }
    // 添加新链接
    linkedList.splice(1, len - 2, ...nodeList)
    for (let i = 0; i < linkedList.length - 1; i++) {
      linkedList[i].connect(linkedList[i + 1])
    }
  }
}

export default Sound
