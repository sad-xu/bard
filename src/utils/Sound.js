const HIGHER_NOTE_MAP = {
  C: 1046.502, // 63: 6C
  'C+': 1108.731, // 64: 6C+
  D: 1174.659, // 65: 6D
  'D+': 1244.508, // 66: 6D+
  E: 1318.510, // 67: 6E
  F: 1396.913, // 68: 6F
  'F+': 1479.978, // 69: 6F+
  G: 1567.982, // 70: 6G
  'G+': 1661.219, // 71: 6G+
  A: 1760.000, // 72: 6A
  'A+': 1864.655, // 73: 6A+
  B: 1975.533 // 74: 6B
}

const NOTE_MAP = {
  C: 523.251,
  'C+': 554.365,
  D: 587.330,
  'D+': 622.254,
  E: 659.255,
  F: 698.456,
  'F+': 739.989,
  G: 783.991,
  'G+': 830.609,
  A: 880.000,
  'A+': 932.328,
  B: 987.767
}

const LOWER_NOTE_MAP = {
  C: 261.626,
  'C+': 277.183,
  D: 293.665,
  'D+': 311.127,
  E: 329.628,
  F: 349.228,
  'F+': 369.994,
  G: 391.995,
  'G+': 415.305,
  A: 440.000,
  'A+': 466.164,
  B: 493.883
}

class Sound {
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)()
    this.sourceList = []
    this.totalGainNode = null
    this.analyser = null
    this.index = 0
  }

  init(maxSource = 3) {
    const context = this.context
    const analyser = context.createAnalyser()
    const totalGainNode = context.createGain()
    const sourceList = []
    for (let i = 0; i < maxSource; i++) {
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(totalGainNode)
      sourceList.push({
        oscillator,
        gainNode
      })
    }
    totalGainNode.connect(analyser)
    analyser.connect(context.destination)
    this.totalGainNode = totalGainNode
    this.analyser = analyser
  }

  // 听个响
  // 音调 A-G
  // 高 低 平 higher lower ''
  sing(note, pitch) {
    const { oscillator, gainNode } = this.sourceList[this.index]
    if (pitch === 'higher') {
      oscillator.freqency.value = HIGHER_NOTE_MAP[note]
    } else if (pitch === 'lower') {
      oscillator.freqency.value = LOWER_NOTE_MAP[note]
    } else {
      oscillator.freqency.value = NOTE_MAP[note]
    }
    gainNode.gain.value = 1
    gainNode.gain.exponentialRampToValueAtTime(0, this.contect.currentTime + 1)
    // this.oscillator.start()
  }

  // 设置总音量
  setVolume(percentage) {
    this.totalGainNode.gain.setValueAtTime(3.4 * percentage, this.contect.currentTime)
  }
}

export default Sound
