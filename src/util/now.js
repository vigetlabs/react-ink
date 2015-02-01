var now = Date.now

if (typeof performance !== 'undefined' && performance.now) {
  now = performance.now.bind(performance)
}

module.exports = now
