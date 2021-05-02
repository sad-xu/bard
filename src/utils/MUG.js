// 音游模式
import { debounce } from '@/utils'

class MUG {
  constructor(wrapperEl) {
    // dom
    this.wrapperEl = null
    this.canvasEl = null
    this.ctx = null
    // size
    this.width = 0
    this.height = 0
    // 乐谱
    this.score = []
    this.scoreIndex = 0 // 乐谱指针
    // 播放状态
    this.isPlay = false
    // 播放时间
    this.t = 0 // 持续时间
    this.lastT = 0 // 上一帧的时刻

    this.init(wrapperEl)
  }

  init(wrapperEl) {
    const that = this
    // 生成canvas元素 设置宽高
    const canvasEl = document.createElement('canvas')
    wrapperEl.appendChild(canvasEl)
    this.wrapperEl = wrapperEl
    this.canvasEl = canvasEl
    this.ctx = canvasEl.getContext('2d')
    this.setWidthHeight()
    // 尺寸自适应
    window.addEventListener('resize', debounce(function() {
      that.setWidthHeight()
    }))
  }

  // 设置宽高
  setWidthHeight() {
    const { wrapperEl, canvasEl } = this
    const width = wrapperEl.clientWidth
    const height = wrapperEl.clientHeight
    canvasEl.width = width
    canvasEl.height = height
    this.width = width
    this.height = height
  }

  // 设置乐谱
  // [按下时刻, 按下时长, 音符]
  // [类型, 时间, 距前一个音符按下的间隔, 音符, 高低八度, 显示1, 显示2, pitch]`
  setScore(score) {
    const scoreList = []
    score.forEach((item, i) => {
      if (item[0] === 'down') {
        scoreList.push([item[1] * 16 + 3000, score[i + 1][1] - item[1], item[7]])
      }
    })
    this.score = scoreList
  }

  // 开始游戏
  play() {
    if (!this.isPlay) {
      this.isPlay = true
      this.lastT = performance.now()
      this.draw()
    }
  }

  //
  draw(time) {
    // 首次循环 time === undefined
    if (time) {
      this.t += time - this.lastT
      this.lastT = time
    }
    const { ctx, width, height } = this

    const list = []
    const score = this.score
    const t = this.t
    for (let i = this.scoreIndex; i < score.length; i++) {
      const scoreTime = score[i][0]
      // 过去的
      if (scoreTime < t) {
        this.scoreIndex = i
      }
      // 现在及未来的
      if (scoreTime >= t - 500 && scoreTime < t + 3000) {
        list.push(score[i])
      }
    }

    ctx.fillStyle = '#f00'
    ctx.font = '16px serif'
    ctx.textAlign = 'center'
    ctx.clearRect(0, 0, width, height)
    list.forEach(item => {
      const x = width * (item[2] - 59) / 37
      const y = height - height * (item[0] - t) / 3000
      const w = 40
      const h = 1 * item[1]
      ctx.fillRect(x - w / 2, y - h / 2, 40, h)
      ctx.strokeText(item[2], x, y)
    })
    // over
    if (!list.length && this.scoreIndex !== 0) {
      this.stop()
    }
    if (this.isPlay) {
      requestAnimationFrame(this.draw.bind(this))
    }
  }

  // 暂停
  stop() {
    if (this.isPlay) {
      console.log(this)
      this.isPlay = false
    }
  }
}

export default MUG
