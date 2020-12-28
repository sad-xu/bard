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
