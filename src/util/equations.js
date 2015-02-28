let easing = require('./easing')
let min    = Math.min
let SQRT_2 = Math.sqrt(2)

function getPress(blot) {
  return min(blot.duration, Date.now() - blot.mouseDown)
}

function getRelease(blot) {
  return blot.mouseUp > 0 ? Date.now() - blot.mouseUp : 0
}

function getRadius(blot) {
  let down = easing(getPress(blot), 0, blot.radius, blot.duration) * 0.85
  let up   = easing(getRelease(blot), 0, blot.radius, blot.duration) * 0.15

  return down + up
}

module.exports = {

  getBlotOpacity(blot) {
    return easing(getRelease(blot), blot.opacity, -blot.opacity, blot.duration)
  },

  getBlotOuterOpacity(blot) {
    return min(this.getBlotOpacity(blot),
               easing(getPress(blot), 0, 0.3, blot.duration * 3))
  },

  getBlotShiftX(blot, size, width) {
    return min(1,
               getRadius(blot) / size * 2 / SQRT_2) * (width / 2 - blot.x)
  },

  getBlotShiftY(blot, size, height) {
    return min(1,
               getRadius(blot) / size * 2 / SQRT_2) * (height / 2 - blot.y)
  },

  getBlotScale(blot) {
    return getRadius(blot) / blot.radius
  }
}
