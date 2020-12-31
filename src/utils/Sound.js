const HIGHER_NOTE_MAP = {
  1: 1046.502,
  '1#': 1108.731,
  2: 1174.659,
  '3b': 1244.508,
  3: 1318.510,
  4: 1396.913,
  '4#': 1479.978,
  5: 1567.982,
  '5#': 1661.219,
  6: 1760.000,
  '7b': 1864.655,
  7: 1975.533
}

const NOTE_MAP = {
  1: 523.251,
  '1#': 554.365,
  2: 587.330,
  '3b': 622.254,
  3: 659.255,
  4: 698.456,
  '4#': 739.989,
  5: 783.991,
  '5#': 830.609,
  6: 880.000,
  '7b': 932.328,
  7: 987.767
}

const LOWER_NOTE_MAP = {
  1: 261.626,
  '1#': 277.183,
  2: 293.665,
  '3b': 311.127,
  3: 329.628,
  4: 349.228,
  '4#': 369.994,
  5: 391.995,
  '5#': 415.305,
  6: 440.000,
  '7b': 466.164,
  7: 493.883
}

class Sound {
  constructor() {
    const context = new (window.AudioContext || window.webkitAudioContext)()
    const analyser = context.createAnalyser()
    const totalGainNode = context.createGain()
    // totalGainNode.gain.setValueAtTime(0.5, context.currentTime)
    analyser.fftSize = 1024
    totalGainNode.connect(analyser)
    analyser.connect(context.destination)
    this.context = context
    this.totalGainNode = totalGainNode
    this.analyser = analyser
    this.singingNum = 0 // 正在发声的发声器数量
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
    oscillator.connect(gainNode)
    gainNode.connect(this.totalGainNode)
    // 试图结束后手动断开连接，结果内存没变，每次调用反而多了一个事件监听 --> gainNode 也会自动断开并回收
    // oscillator.onended = () => {
    //   gainNode.disconnect(this.totalGainNode)
    // }
    if (pitch === 'higher') {
      oscillator.frequency.value = HIGHER_NOTE_MAP[note]
    } else if (pitch === 'lower') {
      oscillator.frequency.value = LOWER_NOTE_MAP[note]
    } else {
      oscillator.frequency.value = NOTE_MAP[note]
    }
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
}

export default new Sound()
