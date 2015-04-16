/**
 * Ink
 * Fills a container with an SVG object that provides feedback on mouse/touch
 * events with a rippling pool.
 */

const HAS_TOUCH  = require('./util/hasTouch')
const MOUSE_LEFT = 0
const pixelRatio = require('./util/pixelRatio')
const React      = require('react')
const STYLE      = require('./style')
const Store      = require('./util/store')
const Types      = React.PropTypes
const TAU        = Math.PI * 2
const Equations  = require('./util/equations')
const Pure       = require('./util/pure')

const Ink = React.createClass({

  shouldComponentUpdate: Pure,

  propTypes: {
    background : Types.bool,
    duration   : Types.number,
    opacity    : Types.number,
    radius     : Types.number,
    recenter   : Types.bool
  },

  getDefaultProps() {
    return {
      background : true,
      duration   : 1000,
      opacity    : 0.25,
      radius     : 150,
      recenter   : true
    }
  },

  getInitialState() {
    return {
      color       : 'transparent',
      density     : 1,
      height      : 0,
      store       : Store(this.tick),
      touchEvents : this.touchEvents(),
      width       : 0
    }
  },

  touchEvents() {
    if (HAS_TOUCH) {
      return {
        onTouchStart  : this._onPress,
        onTouchEnd    : this._onRelease,
        onTouchCancel : this._onRelease,
        onTouchLeave  : this._onRelease
      }
    } else {
      return {
        onMouseDown   : this._onPress,
        onMouseUp     : this._onRelease,
        onMouseLeave  : this._onRelease
      }
    }
  },

  tick() {
    const { ctx, color, density, height, width, store } = this.state

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
  },

  makeBlot(blot) {
    const { ctx, height, width } = this.state
    let { x, y, radius } = blot

    ctx.globalAlpha = Equations.getBlotOpacity(blot, this.props.opacity)
    ctx.beginPath()

    if (this.props.recenter) {
      const size = Math.max(height, width)

      x += Equations.getBlotShiftX(blot, size, width)
      y += Equations.getBlotShiftY(blot, size, height)
    }

    ctx.arc(x, y, radius * Equations.getBlotScale(blot), 0, TAU)

    ctx.closePath()
    ctx.fill()
  },

  componentWillUnmount() {
    this.state.store.stop()
  },

  pushBlot(timeStamp, clientX, clientY) {
    const el = this.getDOMNode()

    const { top, bottom, left, right } = el.getBoundingClientRect()
    const { color }                    = window.getComputedStyle(el)

    const ctx     = this.state.ctx || el.getContext('2d');
    const density = pixelRatio(ctx)
    const height  = bottom - top
    const width   = right - left
    const radius  = Equations.getMaxRadius(height, width, this.props.radius)

    this.setState({ color, ctx, density, height, width }, () => {
      this.state.store.add({
        duration  : this.props.duration,
        mouseDown : timeStamp,
        mouseUp   : 0,
        radius    : radius,
        x         : clientX - left,
        y         : clientY - top
      })
    })
  },

  render() {
    const { density, height, width, touchEvents } = this.state

    return (
      <canvas className="ink"
              style={{ ...STYLE, ...this.props.style }}
              height={ height * density }
              width={ width * density }
              onDragOver={ this._onRelease }
              { ...touchEvents } />
    )
  },

  _onPress(e) {
    const { button, ctrlKey, clientX, clientY, changedTouches } = e
    const timeStamp = Date.now()

    if (changedTouches) {
      for (var i = 0; i < changedTouches.length; i++) {
        const { clientX, clientY } = changedTouches[i]
        this.pushBlot(timeStamp, clientX, clientY)
      }
    } else if (button === MOUSE_LEFT && !ctrlKey) {
      this.pushBlot(timeStamp, clientX, clientY)
    }
  },

  _onRelease() {
    this.state.store.release(Date.now())
  }
})

module.exports = Ink
