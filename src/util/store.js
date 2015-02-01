/**
 * @name Ink Store
 * @desc Keeps track of changes to ripple epicenters
 * so that <Ink /> can focus on rendering them.
 */

var Equations = require('./equations')

module.exports = function(publicize) {
  let _data = []
  let _playing = false
  let _totalOpacity = 0
  let _frame

  let Store = {

    map(callback, scope) {
      return _data.map(callback, scope)
    },

    play() {
      if (!_playing) {
        _playing = true
        Store.update()
      }
    },

    stop() {
      _playing = false;
      cancelAnimationFrame(_frame)
    },

    getTotalOpacity() {
      return _totalOpacity
    },

    update() {
      _totalOpacity = 0

      Store.prune()

      publicize(_frame)

      if (_data.length) {
        _frame = requestAnimationFrame(Store.update)
      } else {
        Store.stop()
      }
    },

    prune() {
      _data = _data.filter(function(blot) {
        blot.opacity   = Equations.getBlotOpacity(blot)
        blot.transform = Equations.getBlotTransform(blot)

        _totalOpacity += Equations.getBlotOuterOpacity(blot)

        return blot.opacity >= 0.01
      })
    },

    add(props) {
      _data.push(props)
      Store.play()
    },

    release(now) {
      for (let i = 0, len = _data.length; i < len; i++) {
        _data[i].mouseUp = _data[i].mouseUp || now
      }

      Store.play()
    }

  }

  return Store
}
