let tid = 0
function setTimer(interval) {
  postMessage('tick')
  tid = setTimeout(function() {
    setTimer(interval)
  }, interval)
}

// { cmd, option }
onmessage = function(e) {
  console.log('worker received: ', e)
  const { cmd, option } = e.data
  if (cmd === 'start') {
    setTimer(option.interval)
  } else if (cmd === 'stop') {
    clearTimeout(tid)
  } else if (cmd === 'close') {
    close()
  }
}

onerror = function(err) {
  console.log(err)
}
