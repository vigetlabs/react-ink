/**
 * Ink Store
 * Keeps track of changes to ripple epicenters
 * so that <Ink /> can focus on rendering them.
 */

var Equations = require('./equations')

let killStale = ({ mouseUp, duration }) =>
  !mouseUp || Date.now() - mouseUp < duration

module.exports = function(publicize) {
  let _data = []
  let _playing = false
  let _frame

  let Store = {
    each(callback, scope) {
      for (var i = 0, l = _data.length; i < l; i++) {
        callback.call(scope, _data[i])
      }
    },

    play() {
      if (!_playing) {
        _playing = true
        Store.update()
      }
    },

    stop() {
      _playing = false
      cancelAnimationFrame(_frame)
    },

    getTotalOpacity(opacity) {
      let answer = 0

      for (var i = 0, l = _data.length; i < l; i++) {
        answer += Equations.getBlotOuterOpacity(_data[i], opacity)
      }

      return answer
    },

    update() {
      _data = _data.filter(killStale)

      if (_data.length) {
        _frame = requestAnimationFrame(Store.update)
      } else {
        Store.stop()
      }

      publicize()
    },

    add(props) {
      _data.push(props)
      Store.play()
    },

    release(time) {
      for (let i = _data.length - 1; i >= 0; i--) {
        if (!_data[i].mouseUp) {
          return (_data[i].mouseUp = time)
        }
      }
    }
  }

  return Store
}
