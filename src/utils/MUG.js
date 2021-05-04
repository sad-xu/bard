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
    // 是否是全键盘
    this.isFullScale = true
    // 播放状态
    this.isPlay = false
    // 播放时间
    this.t = 0 // 持续时间
    this.lastT = 0 // 上一帧的时刻
    // 回调
    this.cb = null
    // 黑白键区分
    this.blackKeys = { 1: 1, 3: 2, 6: 4, 8: 5, 10: 6 }
    this.whiteKeys = { 0: 0, 2: 1, 4: 2, 5: 3, 7: 4, 9: 5, 11: 6 }
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

  // 设置乐谱 是否是全键盘
  // [按下时刻, 按下时长, 音符, 按键]
  // [类型, 时间, 距前一个音符按下的间隔, 音符, 高低八度, 显示1, 显示2, pitch]`
  setScore(score, isFullScale) {
    const scoreList = []
    score.forEach((item, i) => {
      if (item[0] === 'down') {
        scoreList.push([item[1] * 16 + 3000, score[i + 1][1] - item[1], item[7], item[6]])
      }
    })
    this.score = scoreList
    this.isFullScale = isFullScale
  }

  // 开始游戏
  // cb 正常播放完成的回调
  play(cb) {
    if (!this.isPlay) {
      this.isPlay = true
      this.lastT = performance.now()
      this.cb = cb
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
  replay(cb) {
    this.isPlay = false
    this.t = 0
    this.scoreIndex = 0
    this.play(cb)
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

    ctx.shadowBlur = 4
    ctx.font = 'bolder 15px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.clearRect(0, 0, width, height)

    const isFullScale = this.isFullScale
    list.forEach(item => {
      const pitch = item[2]
      let x
      let w
      // 黑白键区分
      const p = pitch % 12
      const isBlack = Boolean(this.blackKeys[p])

      const y = height - height * (item[0] - t) / 3000
      const h = Math.max(1 * item[1], 20)

      if (isFullScale) {
        if (isBlack) {
          x = width / 22 * (Math.floor((pitch - 48) / 12) * 7 + this.blackKeys[p] - 0.5)
          w = width * 0.04
          ctx.shadowColor = '#656060'
          ctx.fillStyle = '#333'
        } else {
          x = width / 22 * (Math.floor((pitch - 48) / 12) * 7 + this.whiteKeys[p])
          w = width / 22
          ctx.shadowColor = '#333'
          ctx.fillStyle = '#e2e1e4'
        }
      } else {
        if (isBlack) {
          x = width / 8 * (this.blackKeys[p] - 0.32)
          w = width * 0.08
          ctx.shadowColor = '#656060'
          ctx.fillStyle = '#333'
        } else {
          x = width / 8 * this.whiteKeys[p]
          w = width / 8
          ctx.shadowColor = '#333'
          ctx.fillStyle = '#e2e1e4'
        }
      }

      this._drawRoundRect(ctx, x, y - h / 2, w, h, 10)
      // 按键显示
      if (item[3]) {
        if (isBlack) {
          ctx.shadowColor = '#333'
          ctx.fillStyle = '#e2e1e4'
        } else {
          ctx.shadowColor = '#e2e1e4'
          ctx.fillStyle = '#333'
        }
        if (pitch <= 59) {
          ctx.fillStyle = '#8092cf'
        } else if (pitch >= 72) {
          ctx.fillStyle = '#dd651b'
        }
        ctx.shadowBlur = 0
        ctx.fillText(item[3], x + w / 2, y)
      }
    })

    // over
    if (!list.length && this.scoreIndex !== 0) {
      this.stop()
      if (this.cb) this.cb()
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
