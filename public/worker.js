let tid = 0
function setTimer() {
  postMessage('tick')
  tid = setTimeout(function() {
    setTimer()
  }, 40)
}

onmessage = function(e) {
  console.log('worker received: ', e)
  const cmd = e.data
  if (cmd === 'start') {
    setTimer()
  } else if (cmd === 'stop') {
    clearTimeout(tid)
  } else if (cmd === 'close') {
    close()
  }
}

onerror = function(err) {
  console.log(err)
}
