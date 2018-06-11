/**
 * Check for touch event support by picking up the first actual touch
 * on the window Listen for an actual touch event on the window. This
 * appears to be the only consistent way to check for touch.
 */

let listening = false
let hasTouch = false
let callbacks = []
let noop = () => {}

function didTouch() {
  hasTouch = true

  for (var i = 0; i < callbacks.length; i++) {
    callbacks[i]()
    callbacks = null
  }

  window.removeEventListener('touchstart', didTouch, true)
}

function init() {
  if (!listening) {
    listening = true
    window.addEventListener('touchstart', didTouch, true)
  }
}

function ignore(callback) {
  let index = callbacks.indexOf(callback)

  if (index >= 0) {
    callbacks.splice(index, 1)
  }
}

export function touchMonitor(callback) {
  if (hasTouch) {
    callback()
    return noop
  } else {
    init()
    callbacks.push(callback)
    return ignore.bind(null, callback)
  }
}
