var easing = require('../../../../lib/easing').easeOutQuint;
var now    = require('../../../../lib/now');
var { max, min } = Math;
var SQRT_2    = Math.sqrt(2);

var Equations = {

  getPress(blot) {
    return min(blot.duration, now() - blot.mouseDown);
  },

  getRelease(blot) {
    return blot.mouseUp > 0 ? now() - blot.mouseUp : 0;
  },

  getBlotRadius(blot) {
    var down = easing(Equations.getPress(blot), 0, blot.radius, blot.duration) * 0.85;
    var up   = easing(Equations.getRelease(blot), 0, blot.radius, blot.duration) * 0.15;

    return down + up;
  },

  getBlotOpacity(blot) {
    return easing(Equations.getRelease(blot), blot.maxOpacity, -blot.maxOpacity, blot.duration);
  },

  getBlotOuterOpacity(blot) {
    return min(
      easing(Equations.getPress(blot), 0, 0.3, blot.duration * 3),
      Equations.getBlotOpacity(blot)
    )
  },

  getBlotTransform(blot) {
    var { duration, recenter, x, y, size, width, height } = blot;

    var shiftX = x;
    var shiftY = y;

    if (recenter) {
      var shift = min(1, Equations.getBlotRadius(blot) / size * 2 / SQRT_2);
      shiftX += shift * (width / 2 - x);
      shiftY += shift * (height / 2 -y);
    }

    var scale = (Equations.getBlotRadius(blot) / blot.radius).toFixed(3);

    return `translate(${ shiftX.toFixed(3) },${ shiftY.toFixed(3) }) scale(${ scale }, ${ scale }) `;
  }

};

module.exports = Equations;
