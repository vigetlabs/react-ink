/**
 * @name Ink Store
 * @desc Keeps track of changes to ripple epicenters
 * so that <Ink /> can focus on rendering them.
 */

var Equations = require('./equations')

module.exports = function(publicize) {
  let _data = []
  let _playing = false
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
      return _data.reduce(function(memo, next) {
        return memo + Equations.getBlotOuterOpacity(next)
      }, 0)
    },

    update() {
      Store.prune()

      publicize(_frame)

      if (_data.length) {
        _frame = requestAnimationFrame(Store.update)
      } else {
        Store.stop()
      }
    },

    shouldPrune(blot) {
      return Equations.getBlotOpacity(blot) > 0.01
    },

    prune() {
      _data = _data.filter(this.shouldPrune)
    },

    add(props) {
      _data.push(props)
      Store.play()
    },

    release(time) {
      for (let i = _data.length - 1; i >= 0; i--) {
        if (!_data[i].mouseUp) {
          return _data[i].mouseUp = time
        }
      }
    }

  }

  return Store
}
