import { easeOutQuint } from './easing'

const SQRT_2 = Math.sqrt(2)
const { cos, max, min } = Math

function getPress(blot) {
  return min(blot.duration, Date.now() - blot.mouseDown)
}

function getRelease(blot) {
  return blot.mouseUp > 0 ? Date.now() - blot.mouseUp : 0
}

function getRadius(blot) {
  let { duration, radius } = blot

  let down = easeOutQuint(getPress(blot), 0, radius, duration) * 0.85
  let up = easeOutQuint(getRelease(blot), 0, radius, duration) * 0.15
  let undulation = radius * 0.02 * cos(Date.now() / duration)

  return max(0, down + up + undulation)
}

export function getMaxRadius(height, width, radius) {
  return min(max(height, width) * 0.5, radius)
}

export function getBlotOpacity(blot, opacity) {
  return easeOutQuint(getRelease(blot), opacity, -opacity, blot.duration)
}

export function getBlotOuterOpacity(blot, opacity) {
  return min(
    getBlotOpacity(blot, opacity),
    easeOutQuint(getPress(blot), 0, 0.3, blot.duration * 3)
  )
}

export function getBlotShiftX(blot, size, width) {
  return min(1, getRadius(blot) / size * 2 / SQRT_2) * (width / 2 - blot.x)
}

export function getBlotShiftY(blot, size, height) {
  return min(1, getRadius(blot) / size * 2 / SQRT_2) * (height / 2 - blot.y)
}

export function getBlotScale(blot) {
  return getRadius(blot) / blot.radius
}
