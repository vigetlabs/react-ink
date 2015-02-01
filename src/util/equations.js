let easing = require('./easing')
let now    = require('./now')
let min    = Math.min
let SQRT_2 = Math.sqrt(2)

let Equations = {

  getPress(blot) {
    return min(blot.duration, now() - blot.mouseDown)
  },

  getRelease(blot) {
    return blot.mouseUp > 0 ? now() - blot.mouseUp : 0
  },

  getBlotRadius(blot) {
    let down = easing(Equations.getPress(blot), 0, blot.radius, blot.duration) * 0.85
    let up   = easing(Equations.getRelease(blot), 0, blot.radius, blot.duration) * 0.15

    return down + up
  },

  getBlotOpacity(blot) {
    return easing(Equations.getRelease(blot), blot.maxOpacity, -blot.maxOpacity, blot.duration)
  },

  getBlotOuterOpacity(blot) {
    return min(
      easing(Equations.getPress(blot), 0, 0.3, blot.duration * 3),
      blot.opacity
    )
  },

  getBlotTransform(blot) {
    let { recenter, x, y, size, width, height } = blot

    let shiftX = x
    let shiftY = y

    if (recenter) {
      let shift = min(1, Equations.getBlotRadius(blot) / size * 2 / SQRT_2)
      shiftX += shift * (width / 2 - x)
      shiftY += shift * (height / 2 -y)
    }

    let scale = (Equations.getBlotRadius(blot) / blot.radius)

    return `translate(${ shiftX },${ shiftY }) scale(${ scale }, ${ scale }) `
  }

}

module.exports = Equations
