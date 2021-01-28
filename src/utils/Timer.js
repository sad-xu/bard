
class Timer {
  constructor() {
    this.worker = null
    // free / running / stop
    this.status = 'free'
  }

  init(cb) {
    this.worker = new Worker('/worker.js')
    this.worker.onmessage = cb
    this.start()
  }

  start() {
    if (this.status === 'stop' || this.status === 'free') {
      this.status = 'running'
      this.worker.postMessage('start')
    }
  }

  stop() {
    if (this.status === 'running') {
      this.status = 'stop'
      this.worker.postMessage('stop')
    }
  }

  end() {
    this.status = 'free'
    this.worker.terminate()
  }
}

export default new Timer()
