
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
    this.setVolume(0.5)
    // 保存实例
    instanceList.push(this)
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
    if (percentage <= 0) percentage = 0.0001
    this.volume = percentage
    this.totalGainNode.gain.exponentialRampToValueAtTime(3.4 * percentage, this.context.currentTime + 1)
  }
}

/* 针对所有实例 */

// 设置总音量
Sound.setAllVolume = function(percentage) {
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
  testA: {
    real: [
      0, 0, -0.203569, 0.5, -0.401676, 0.137128, -0.104117, 0.115965,
      -0.004413, 0.067884, -0.00888, 0.0793, -0.038756, 0.011882, -0.030883, 0.027608
      // -0.013429, 0.00393, -0.014029, 0.00972, -0.007653, 0.007866, -0.032029, 0.046127,
      // -0.024155, 0.023095, -0.005522, 0.004511, -0.003593, 0.011248, -0.004919, 0.008505
    ],
    imag: [
      0, 0.147621, 0, 0.000007, -0.00001, 0.000005, -0.000006, 0.000009,
      0, 0.000008, -0.000001, 0.000014, -0.000008, 0.000003, -0.000009, 0.000009
      // -0.000005, 0.000002, -0.000007, 0.000005, -0.000005, 0.000005, -0.000023, 0.000037,
      // -0.000021, 0.000022, -0.000006, 0.000005, -0.000004, 0.000014, -0.000007, 0.000012
    ]
  },
  testB: {
    real: [
      0.000000, 0.171738, 0.131907, -0.194800, -0.129913, -0.081043, 0.049213, 0.027828,
      -0.008357, -0.005044, 0.002145, 0.000773, -0.001392, -0.000916, -0.000012, 0.000323,
      -0.000003, 0.000127, -0.000135, -0.000029, -0.000031, 0.000087, -0.000091, 0.000005,
      -0.000026, 0.000027, -0.000062, -0.000017, -0.000002, 0.000002, 0.000012, -0.000024
    ],
    imag: [
      0.000000, -0.090905, 0.482287, 0.259485, 0.009402, -0.125271, -0.046816, 0.007872,
      0.001762, -0.010488, -0.002305, 0.001791, 0.001101, -0.000303, -0.000064, 0.000143,
      0.000059, 0.000116, 0.000120, -0.000011, -0.000066, -0.000019, 0.000024, 0.000014,
      0.000069, 0.000056, 0.000005, 0.000002, -0.000026, -0.000015, 0.000055, 0.000012
    ]
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
