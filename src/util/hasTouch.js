var bool = false

if (typeof window !== 'undefined') {
  bool = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch
}

module.exports = bool
