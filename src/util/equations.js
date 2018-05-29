let easing = require('./easing')
let SQRT_2 = Math.sqrt(2)
let { cos, max, min } = Math

function getPress(blot) {
  return min(blot.duration, Date.now() - blot.mouseDown)
}

function getRelease(blot) {
  return blot.mouseUp > 0 ? Date.now() - blot.mouseUp : 0
}

function getRadius(blot) {
  let { duration, radius } = blot

  let down = easing(getPress(blot), 0, radius, duration) * 0.85
  let up = easing(getRelease(blot), 0, radius, duration) * 0.15
  let undulation = radius * 0.02 * cos(Date.now() / duration)

  return max(0, down + up + undulation)
}

module.exports = {
  getMaxRadius(height, width, radius) {
    return min(max(height, width) * 0.5, radius)
  },

  getBlotOpacity(blot, opacity) {
    return easing(getRelease(blot), opacity, -opacity, blot.duration)
  },

  getBlotOuterOpacity(blot, opacity) {
    return min(
      this.getBlotOpacity(blot, opacity),
      easing(getPress(blot), 0, 0.3, blot.duration * 3)
    )
  },

  getBlotShiftX(blot, size, width) {
    return (
      min(1, ((getRadius(blot) / size) * 2) / SQRT_2) * (width / 2 - blot.x)
    )
  },

  getBlotShiftY(blot, size, height) {
    return (
      min(1, ((getRadius(blot) / size) * 2) / SQRT_2) * (height / 2 - blot.y)
    )
  },

  getBlotScale(blot) {
    return getRadius(blot) / blot.radius
  }
}
