// Good stuff here:
// http://www.html5rocks.com/en/tutorials/canvas/hidpi/

module.exports = context => {
  let devicePixelRatio = window.devicePixelRatio || 1
  let backingStoreRatio =
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1

  return devicePixelRatio / backingStoreRatio
}
