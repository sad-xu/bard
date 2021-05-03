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
  // [按下时刻, 按下时长, 音符, 按键]
  // [类型, 时间, 距前一个音符按下的间隔, 音符, 高低八度, 显示1, 显示2, pitch]`
  setScore(score) {
    const scoreList = []
    score.forEach((item, i) => {
      if (item[0] === 'down') {
        scoreList.push([item[1] * 16 + 3000, score[i + 1][1] - item[1], item[7], item[6]])
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

  // 暂停
  stop() {
    if (this.isPlay) {
      console.log(this)
      this.isPlay = false
    }
  }

  // 重玩
  replay() {
    this.isPlay = false
    this.t = 0
    this.play()
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

    ctx.shadowBlur = 10
    ctx.font = '16px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.clearRect(0, 0, width, height)

    list.forEach(item => {
      const pitch = item[2]
      // TODO: 音符位置
      const x = width / 37 * (pitch - 48)
      const y = height - height * (item[0] - t) / 3000
      const w = width / 37
      const h = Math.max(1 * item[1], 20)

      if (pitch <= 59) {
        ctx.shadowColor = '#85e9e1'
        ctx.fillStyle = '#85e9e1'
      } else if (pitch >= 72) {
        ctx.shadowColor = '#e0651d'
        ctx.fillStyle = '#e0651d'
      } else {
        ctx.shadowColor = '#fff'
        ctx.fillStyle = '#fff'
      }

      this._drawRoundRect(ctx, x - w, y - h / 2, w, h, 10)
      // 按键显示
      if (item[3]) {
        ctx.strokeText(item[3], x - w / 2, y)
      }
    })
    // over
    if (!list.length && this.scoreIndex !== 0) {
      this.stop()
    }
    if (this.isPlay) {
      requestAnimationFrame(this.draw.bind(this))
    }
  }

  // 绘制圆角矩形
  _drawRoundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.arcTo(x + width, y, x + width, y + height, radius)
    ctx.arcTo(x + width, y + height, x, y + height, radius)
    ctx.arcTo(x, y + height, x, y, radius)
    ctx.arcTo(x, y, x + radius, y, radius)
    ctx.fill()
  }
}

export default MUG
