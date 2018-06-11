var bool = false

if (typeof window !== 'undefined') {
  bool =
    'ontouchstart' in window ||
    (window.DocumentTouch && document instanceof window.DocumentTouch)
}

export const HAS_TOUCH = bool
