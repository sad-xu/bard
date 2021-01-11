
//
function bytesToNumber(byteArray) {
  return parseInt(bytesToHex(byteArray), 16)
}

//
function bytesToHex(byteArray) {
  let hex = ''
  byteArray.forEach(byte => {
    hex += ('0' + byte.toString(16)).slice(-2)
  })
  return hex
}

//
function bytesToLetters(byteArray) {
  let letters = ''
  byteArray.forEach(byte => {
    letters += String.fromCharCode(byte)
  })
  return letters
}

// 计算动态字节值
function getTruthNum(byteArray) {
  let sum = 0
  byteArray.forEach(byte => {
    if (byte & 0x80) {
      sum += (byte & 0x7f)
      sum <<= 7
    } else sum += byte
  })
  return sum
}

/*
  头块 + 音轨块 * n

  头块 <标志符串MThd>(4字节) + <头块数据区长度>(4字节) + <头块数据区>(6字节) ff ff tt tt dd dd
  音轨块 <标志符串MTrk>(4字节) + <音轨块数据区长度>(4字节) + <音轨块数据区>(多个MIDI事件构成)

  MIDI事件 <delta time> + <MIDI 消息>
  MIDI消息 <状态字节> + <数据字节> * n
  状态字节 最高位为1 128 ~ 255
  数据字节 最高位为0 0 ~ 127

  Example: 植物大战僵尸.mid
    0, 255, 88, 4, 4, 2, 8, 82 // 0 FF 58 节拍 一个四分音符包含的32分音符的个数
    0, 255, 81, 3, 8, 82, 174  // 0 FF 51 速度  0x852ae = 545454微秒
    0, 255, 3, 1, 49 // 0 FF 歌曲/音轨名 0x31
    0, 193, 0 // 0 C1 改变乐器 0
    0, 192, 0 // 0 C0 改变乐器 0
    143, 0, 177, 95, 0 // 1920 B1 控制器编号 值
    0, 177, 92, 0,
    0, 176, 100, 0,
    129, 85, 128, 73, 0, // 213 0x80 松开音符
*/
export function parseMIDI(arrayBuffer) {
  const buffer = new Uint8Array(arrayBuffer)
  const midiInfo = {
    headerChunk: {
      id: bytesToLetters(buffer.subarray(0, 4)),
      length: bytesToNumber(buffer.subarray(4, 8)),
      ffff: buffer.subarray(8, 10), // 00 单音轨 01 多个同步音轨 10 多个独立音轨
      tttt: bytesToNumber(buffer.subarray(10, 12)), // 音轨块数
      dddd: buffer.subarray(12, 14),
      timingType: (buffer.subarray(12, 13) & 0b1000) >> 3, //  0 ticks计时 1 SMPTE计时
      tick: buffer.subarray(13, 14) & 0b01111111
    },
    trackChunk: []
  }
  //
  const trackChunk = []
  for (let i = 14; i < buffer.length;) {
    if (buffer.subarray(i, i + 4).join('') === '7784114107') {
      const trackLen = bytesToNumber(buffer.subarray(i + 4, i + 8))
      const track = buffer.subarray(i + 8, i + 8 + trackLen)
      trackChunk.push(track)
      i += trackLen + 8
    } else i += 8
  }
  //
  console.log(trackChunk)
  const tracks = []
  trackChunk.forEach(track => {
    const list = []
    const len = track.length
    for (let i = 0; i < len;) {
      const start = i
      while (track[i] >= 128) {
        i++
      }
      i++
      const time = getTruthNum(track.subarray(start, i)) // delta time
      const stat = track[i] // 状态字节
      const item = [time]
      switch (true) {
        case stat >= 0x80 && stat <= 0x8f:
          item.push(track.subarray(i + 1, i + 3))
          item.push('声音关闭')
          i += 3
          break
        case stat >= 0x90 && stat <= 0x9f:
          item.push(track.subarray(i + 1, i + 3))
          item.push('声音开启')
          i += 3
          break
        case stat >= 0xa0 && stat <= 0xaf:
          item.push(track.subarray(i + 1, i + 3))
          item.push('音键压力')
          i += 3
          break
        case stat >= 0xb0 && stat <= 0xbf:
          item.push(track.subarray(i + 1, i + 3))
          item.push('控制变化')
          i += 3
          break
        case stat >= 0xc0 && stat <= 0xcf:
          item.push(track.subarray(i + 1, i + 2))
          item.push('改变乐器')
          i += 2
          break
        case stat >= 0xd0 && stat <= 0xdf:
          item.push(track.subarray(i + 1, i + 2))
          item.push('通道触动压力')
          i += 2
          break
        case stat >= 0xe0 && stat <= 0xef:
          item.push(track.subarray(i + 1, i + 3))
          item.push('弯音轮变换')
          i += 3
          break
        case stat === 0xf2:
          item.push(track.subarray(i + 1, i + 3))
          item.push('歌曲位道指针')
          i += 3
          break
        case stat === 0xf3:
          item.push(track.subarray(i + 1, i + 2))
          item.push('歌曲选择')
          i += 2
          break
        case stat === 0xf0 || stat === 0xf7: {
          i += 1
          const start = i
          while (track[i] >= 128) {
            i++
          }
          i++
          const len = getTruthNum(track.subarray(start, i))
          item.push(track.subarray(i, i + len))
          i += len
          break
        }
        case stat === 0xff: {
          i += 2
          const type = track[i - 1]
          const start = i
          while (track[i] >= 128) {
            i++
          }
          i++
          const len = getTruthNum(track.subarray(start, i))
          item.push(type)
          item.push(track.subarray(i, i + len))
          i += len
          break
        }
      }
      list.push(item)
    }
    tracks.push(list)
  })

  midiInfo.trackChunk = tracks
  return midiInfo
}
