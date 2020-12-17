
// 音階表記リスト
// フラット・シャープは別途計算する
var WebAudioPlayerPitchNameMap = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11
}

// 周波数リスト
var WebAudioPlayerFrequencyList = [
  261.626, // 39: 4C
  277.183, // 40: 4C+
  293.665, // 41: 4D
  311.127, // 42: 4D+
  329.628, // 43: 4E
  349.228, // 44: 4F
  369.994, // 45: 4F+
  391.995, // 46: 4G
  415.305, // 47: 4G+
  440.000, // 48: 4A
  466.164, // 49: 4A+
  493.883, // 50: 4B

  523.251, // 51: 5C
  554.365, // 52: 5C+
  587.330, // 53: 5D
  622.254, // 54: 5D+
  659.255, // 55: 5E
  698.456, // 56: 5F
  739.989, // 57: 5F+
  783.991, // 58: 5G
  830.609, // 59: 5G+
  880.000, // 60: 5A
  932.328, // 61: 5A+
  987.767, // 62: 5B

  1046.502, // 63: 6C
  1108.731, // 64: 6C+
  1174.659, // 65: 6D
  1244.508, // 66: 6D+
  1318.510, // 67: 6E
  1396.913, // 68: 6F
  1479.978, // 69: 6F+
  1567.982, // 70: 6G
  1661.219, // 71: 6G+
  1760.000, // 72: 6A
  1864.655, // 73: 6A+
  1975.533 // 74: 6B
]

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
  sing(s) {
    const { oscillator, gainNode } = this.sourceList[this.index]
    oscillator.freqency.value = 523.251
    gainNode.gain.value = 1
    gainNode.gain.exponentialRampToValueAtTime(0, this.contect.currentTime + 1)
    // this.oscillator.start()
  }

  // 设置音量
  setVolume(percentage) {
    this.totalGainNode.gain.setValueAtTime(3.4 * percentage, this.contect.currentTime)
  }
}

export default Sound
