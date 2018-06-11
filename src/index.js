/**
 * Ink
 * Fills a container with an SVG object that provides feedback on mouse/touch
 * events with a rippling pool.
 */

import React from 'react'
import { HAS_TOUCH } from './util/hasTouch'
import { pixelRatio } from './util/pixelRatio'
import { STYLE } from './style'
import { Store } from './util/store'
import { merge } from './util/merge'
import {
  getBlotScale,
  getBlotOpacity,
  getBlotShiftX,
  getBlotShiftY,
  getMaxRadius
} from './util/equations'

const TAU = Math.PI * 2
const MOUSE_LEFT = 0

const defaultProps = {
  background: true,
  className: 'ink',
  duration: 1000,
  opacity: 0.25,
  radius: 150,
  recenter: true,
  hasTouch: HAS_TOUCH
}

export default class Ink extends React.PureComponent {
  constructor(props) {
    super(...arguments)

    this.state = {
      color: 'transparent',
      density: 1,
      height: 0,
      store: Store(this.tick.bind(this)),
      width: 0
    }

    this.touchEvents = this.touchEvents()
  }

  touchEvents() {
    if (this.props.hasTouch) {
      return {
        onTouchStart: this._onPress.bind(this),
        onTouchEnd: this._onRelease.bind(this),
        onTouchCancel: this._onRelease.bind(this)
      }
    } else {
      return {
        onMouseDown: this._onPress.bind(this),
        onMouseUp: this._onRelease.bind(this),
        onMouseLeave: this._onRelease.bind(this)
      }
    }
  }

  tick() {
    let { ctx, color, density, height, width, store } = this.state

    ctx.save()

    ctx.scale(density, density)

    ctx.clearRect(0, 0, width, height)

    ctx.fillStyle = color

    if (this.props.background) {
      ctx.globalAlpha = store.getTotalOpacity(this.props.opacity)
      ctx.fillRect(0, 0, width, height)
    }

    store.each(this.makeBlot, this)

    ctx.restore()
  }

  makeBlot(blot) {
    let { ctx, height, width } = this.state
    let { x, y, radius } = blot

    ctx.globalAlpha = getBlotOpacity(blot, this.props.opacity)
    ctx.beginPath()

    if (this.props.recenter) {
      let size = Math.max(height, width)

      x += getBlotShiftX(blot, size, width)
      y += getBlotShiftY(blot, size, height)
    }

    ctx.arc(x, y, radius * getBlotScale(blot), 0, TAU)

    ctx.closePath()
    ctx.fill()
  }

  componentWillUnmount() {
    this.state.store.stop()
  }

  pushBlot(timeStamp, clientX, clientY) {
    let el = this.canvas

    // 0.13 support
    if (el.getDOMNode && 'function' === typeof el.getDOMNode) {
      el = el.getDOMNode()
    }

    let { top, bottom, left, right } = el.getBoundingClientRect()
    let { color } = window.getComputedStyle(el)

    let ctx = this.state.ctx || el.getContext('2d')
    let density = pixelRatio(ctx)
    let height = bottom - top
    let width = right - left
    let radius = getMaxRadius(height, width, this.props.radius)

    this.setState({ color, ctx, density, height, width }, () => {
      this.state.store.add({
        duration: this.props.duration,
        mouseDown: timeStamp,
        mouseUp: 0,
        radius: radius,
        x: clientX - left,
        y: clientY - top
      })
    })
  }

  setCanvas(el) {
    this.canvas = el
  }

  render() {
    let { className, density, height, width } = this.state
    let { style } = this.props

    let props = merge(
      {
        className: className,
        ref: this.setCanvas.bind(this),
        height: height * density,
        width: width * density,
        onDragOver: this._onRelease,
        style: merge(STYLE, style)
      },
      this.touchEvents
    )

    return React.createElement('canvas', props)
  }

  _onPress(event) {
    let { button, ctrlKey, clientX, clientY, changedTouches } = event
    let timeStamp = Date.now()

    if (changedTouches) {
      for (var i = 0; i < changedTouches.length; i++) {
        let { clientX, clientY } = changedTouches[i]
        this.pushBlot(timeStamp, clientX, clientY)
      }
    } else if (button === MOUSE_LEFT && !ctrlKey) {
      this.pushBlot(timeStamp, clientX, clientY)
    }
  }

  _onRelease() {
    this.state.store.release(Date.now())
  }
}

Ink.defaultProps = defaultProps
