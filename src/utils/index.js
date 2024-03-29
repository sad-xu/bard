// 简易防抖
export function debounce(fn, wait = 300) {
  let timeId = null
  return function(...args) {
    clearTimeout(timeId)
    timeId = setTimeout(() => {
      fn.apply(this, args)
    }, wait)
  }
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
// Use a lookup table to find the index.
const lookup = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256)
for (let i = 0; i < chars.length; i++) {
  lookup[chars.charCodeAt(i)] = i
}

/** base64 => arraybuffer  without atob */
export function base64ToArrayBuffer(base64) {
  let bufferLength = base64.length * 0.75
  const len = base64.length
  let i
  let p = 0
  let encoded1
  let encoded2
  let encoded3
  let encoded4

  if (base64[base64.length - 1] === '=') {
    bufferLength--
    if (base64[base64.length - 2] === '=') {
      bufferLength--
    }
  }

  const arraybuffer = new ArrayBuffer(bufferLength)
  const bytes = new Uint8Array(arraybuffer)

  for (i = 0; i < len; i += 4) {
    encoded1 = lookup[base64.charCodeAt(i)]
    encoded2 = lookup[base64.charCodeAt(i + 1)]
    encoded3 = lookup[base64.charCodeAt(i + 2)]
    encoded4 = lookup[base64.charCodeAt(i + 3)]

    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4)
    bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2)
    bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63)
  }
  return arraybuffer
}
