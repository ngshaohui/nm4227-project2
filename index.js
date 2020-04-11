function getTimerText(time) {
  function padWithZero(num) {
    return ('0' + num).slice(-2)
  }
  const timeInMinutes = Math.floor(time / 60) % 3600
  const timeInSeconds = Math.round(time) % 60
  return `${padWithZero(timeInMinutes)}:${padWithZero(timeInSeconds)}`
}

const time = Math.floor(Math.random() * 360 + 100)
const deaths = Math.floor(Math.random() * 50 + 5)
document.getElementById('time').innerHTML = getTimerText(time)
document.getElementById('deaths').innerHTML = deaths
