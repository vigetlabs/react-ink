let easing = require('./easing')
let now    = require('./now')
let min    = Math.min
let SQRT_2 = Math.sqrt(2)

function getPress(blot) {
  return min(blot.duration, now() - blot.mouseDown)
}

function getRelease(blot) {
  return blot.mouseUp > 0 ? now() - blot.mouseUp : 0
}

function getRadius(blot) {
  let down = easing(getPress(blot), 0, blot.radius, blot.duration) * 0.85
  let up   = easing(getRelease(blot), 0, blot.radius, blot.duration) * 0.15

  return down + up
}

module.exports = {

  getBlotOpacity(blot) {
    return easing(getRelease(blot), blot.maxOpacity, -blot.maxOpacity, blot.duration)
  },

  getBlotOuterOpacity(blot) {
    return min(blot.opacity, easing(getPress(blot), 0, 0.3, blot.duration * 3))
  },

  getBlotTransform(blot) {
    let { recenter, x, y, size, width, height } = blot

    let radius = getRadius(blot)

    if (recenter) {
      let shift = min(1, radius / size * 2 / SQRT_2)
      x += shift * (width / 2 - x)
      y += shift * (height / 2 -y)
    }

    let scale = (radius / blot.radius)

    return `translate(${ x },${ y }) scale(${ scale }, ${ scale }) `
  }
}
