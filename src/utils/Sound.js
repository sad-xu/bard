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
  constructor(maxSource = 5) {
    const context = new (window.AudioContext || window.webkitAudioContext)()
    const analyser = context.createAnalyser()
    const totalGainNode = context.createGain()
    const sourceList = []
    for (let i = 0; i < maxSource; i++) {
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()
      oscillator.frequency.value = 0
      oscillator.connect(gainNode)
      gainNode.connect(totalGainNode)
      // oscillator.start()
      sourceList.push({
        oscillator,
        gainNode
      })
    }
    totalGainNode.connect(analyser)
    analyser.connect(context.destination)
    this.context = context
    this.sourceList = sourceList
    this.totalGainNode = totalGainNode
    this.analyser = analyser
    this.index = 0
    this.flag = true
  }

  // 听个响
  // 音调 A-G
  // 高 低 平 higher lower ''
  sing(note, pitch) {
    if (this.flag) {
      this.sourceList.forEach(item => {
        item.oscillator.start()
      })
      this.flag = false
    }
    const { oscillator, gainNode } = this.sourceList[this.index]
    this.index = (this.index + 1) % this.sourceList.length
    if (pitch === 'higher') {
      oscillator.frequency.value = HIGHER_NOTE_MAP[note]
    } else if (pitch === 'lower') {
      oscillator.frequency.value = LOWER_NOTE_MAP[note]
    } else {
      oscillator.frequency.value = NOTE_MAP[note]
    }
    // gainNode.gain.value = 1
    const currentTime = this.context.currentTime
    gainNode.gain.exponentialRampToValueAtTime(1, currentTime + 0.1)
    gainNode.gain.exponentialRampToValueAtTime(0.00001, currentTime + 2)
    // this.oscillator.start()
  }

  // 设置总音量
  setVolume(percentage) {
    this.totalGainNode.gain.setValueAtTime(3.4 * percentage, this.context.currentTime)
  }
}

export default Sound
