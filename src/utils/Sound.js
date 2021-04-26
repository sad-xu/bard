// 4 5 6
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

  'i-h': 2093,
  i: 1046.502
}

const HALF_RATIO = 1.059463

const instanceList = []

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

    analyser.fftSize = 1024
    totalGainNode.connect(analyser)
    analyser.connect(compressor)
    compressor.connect(context.destination)
    this.context = context
    this.volume = 0 // 音量百分比
    this.duration = 1.5 // 声音持续时间
    this.totalGainNode = totalGainNode
    this.analyser = analyser
    this.singingNum = 0 // 正在发声的发声器数量
    //
    this.wave = 'sine' // 声源波形
    this.real = []
    this.imag = []
    this.linkedList = [totalGainNode, analyser] // 维护当前节点链
    this.setVolume(localStorage.getItem('volume') || 0.3)
    // 保存实例
    instanceList.push(this)
  }

  // 听个响
  // 音调 A-G
  // 高 低 平 higher lower ''
  // 高/低 半音 high low
  // https://blog.szynalski.com/2014/04/web-audio-api/
  sing(note, pitch, semitone) {
    this.singingNum++
    const context = this.context
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()
    if (this.wave === 'custom') {
      oscillator.setPeriodicWave(context.createPeriodicWave(this.real, this.imag))
    } else {
      oscillator.type = this.wave
    }
    oscillator.connect(gainNode)
    gainNode.connect(this.totalGainNode)
    // 试图结束后手动断开连接，结果内存没变，每次调用反而多了一个事件监听 --> gainNode 也会自动断开并回收
    // oscillator.onended = () => {
    //   gainNode.disconnect(this.totalGainNode)
    // }
    let mul = 1 // 高频 * 2  低频 / 2
    if (pitch === 'higher') mul = 2
    else if (pitch === 'lower') mul = 0.5
    if (semitone === 'high') mul *= HALF_RATIO
    else if (semitone === 'low') mul /= HALF_RATIO
    oscillator.frequency.value = NOTE_MAP[note] * mul
    //
    const currentTime = this.context.currentTime
    oscillator.start()
    gainNode.gain.exponentialRampToValueAtTime(1, currentTime + 0.1)
    gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + this.duration)
    oscillator.stop(currentTime + this.duration)
    setTimeout(() => {
      this.singingNum--
    }, 2000)
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
Sound.setAllVolume = function(percentage) {
  localStorage.setItem('volume', percentage)
  instanceList.forEach(instance => {
    instance.setVolume(percentage)
  })
}

// 设置持续时间
Sound.setAllDuration = function(duration) {
  instanceList.forEach(instance => {
    instance.duration = duration
  })
}

// 设置音源波形
const periodicWaveMap = {
  bass: {
    real: [0, 1, 0.8144, 0.2062, 0.02062],
    imag: [0, 0, 0, 0, 0]
  },
  brass: {
    real: [0, 0.4, 0.4, 1, 1, 1, 0.3, 0.7, 0.6, 0.5, 0.9, 0.8],
    imag: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  chiptune: {
    real: Array.from({ length: 16 }, (_, n) => (
      n === 0
        ? 0
        : 4 / (n * Math.PI) * Math.sin(Math.PI * n * 0.18)
    )),
    imag: Array.from({ length: 16 }, () => 0)
  },
  organ: {
    real: [0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    imag: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  organ2: {
    real: [0, 0.8, 0.6, 0.6, 0.7, 0.6, 0, 0.8, 0.3, 1],
    imag: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  aah: {
    real: [0, 0.246738, 0.08389, 0.095378, 0.087885, 0.165621, 0.287369, -0.328845, -0.099613, -0.198535, 0.260484, 0.012771, 0.013351, 0.006221, 0.003106, 0.000629],
    imag: [0, -0.011959, 0.106385, 0.027196, 0.04077, 0.010807, -0.17632, -0.376644, 0.052966, 0.242678, 0.322558, -0.029071, -0.017862, -0.018765, -0.010794, -0.010157]
  },
  celeste: {
    real: [0, 0, -0.5, 0.000521, -0.001138, 0.000116, -0.001202, 0.000081, -0.000772, 0.000116, -0.000752, 0.000144, -0.000122, 0.000027, -0.000623, 0.000121],
    imag: [0, 0.002302, -0.000003, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  wurlitzer: {
    real: [0, 0, -0.382713, 0.5, -0.114418, 0.453856, -0.121481, 0.273632, -0.190467, 0.116104, -0.171632, 0.02464, -0.13362, 0.028582, -0.103649, 0.085895],
    imag: [0, 0.321119, -0.000002, 0.000007, -0.000003, 0.000017, -0.000007, 0.00002, -0.000018, 0.000014, -0.000026, 0.000004, -0.000029, 0.000007, -0.000031, 0.000029]
  }
}

Sound.setAllWave = function(waveType = 'sine', diyWave) {
  instanceList.forEach(instance => {
    const periodicWave = periodicWaveMap[waveType]
    if (waveType === 'diy' || periodicWave) {
      instance.wave = 'custom'
      instance.real = periodicWave ? periodicWave.real : diyWave.real
      instance.imag = periodicWave ? periodicWave.imag : diyWave.imag
    } else {
      instance.wave = waveType
    }
  })
}

// 设置滤波器
Sound.setAllFilters = function(list) {
  instanceList.forEach(instance => {
    const nodeList = []
    list.forEach(({ checked, type, freq, Q, gain }) => {
      if (checked) {
        const biquadFilter = instance.context.createBiquadFilter()
        const currentTime = instance.context.currentTime
        biquadFilter.type = type
        biquadFilter.frequency.setValueAtTime(freq, currentTime)
        biquadFilter.Q.setValueAtTime(Q, currentTime)
        biquadFilter.gain.setValueAtTime(gain, currentTime)
        nodeList.push(biquadFilter)
      }
    })
    const linkedList = instance.linkedList
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
  })
}

export default Sound
