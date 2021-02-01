class Timer {
  constructor() {
    this.worker = null
    // 计时器间隔时间
    this.interval = 0
    // free / running / stop
    this.status = 'free'
  }

  init(cb, interval = 20) {
    this.interval = interval
    this.worker = new Worker('/worker.js')
    this.worker.onmessage = cb
    this.start()
  }

  start() {
    if (this.status === 'stop' || this.status === 'free') {
      this.status = 'running'
      this.worker.postMessage({
        cmd: 'start',
        option: { interval: this.interval }
      })
    }
  }

  stop() {
    if (this.status === 'running') {
      this.status = 'stop'
      this.worker.postMessage({
        cmd: 'stop'
      })
    }
  }

  end() {
    this.status = 'free'
    this.worker.terminate()
  }
}

export default new Timer()
