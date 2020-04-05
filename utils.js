const SCREEN_HEIGHT = 14
const SCREEN_WIDTH = 26
const TILE_SIZE = 32
const TIMEOUT_DURATION = 3500

function throttle(func, limit) {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  throttle,
  TILE_SIZE,
  TIMEOUT_DURATION,
}
