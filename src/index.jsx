/**
 * Ink
 *
 * Fills a container with an SVG object that provides feedback on mouse/touch
 * events with a rippling pool.
 */

let HAS_TOUCH  = require('./util/hasTouch')
let MOUSE_LEFT = 0
let pixelRatio = require('./util/pixelRatio')
let React      = require('react')
let STYLE      = require('./style')
let Store      = require('./util/store')
let Types      = React.PropTypes
let TAU        = Math.PI * 2
let Equations  = require('./util/equations')

let Ink = React.createClass({

  shouldComponentUpdate(props, state) {
    for (let p in props) {
      if (this.props[p] !== props[p]) return true
    }

    for (let s in state) {
      if (this.state[s] !== state[s]) return true
    }

    return false
  },

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
      duration   : 1500,
      opacity    : 0.2,
      radius     : 150,
      recenter   : true
    }
  },

  getInitialState() {
    return {
      store       : Store(this.tick),
      touchEvents : this.touchEvents()
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
    let { ctx, color, height, width, store } = this.state

    let density = pixelRatio(ctx)

    ctx.save()

    ctx.scale(density, density)

    ctx.clearRect(0, 0, width, height)

    ctx.fillStyle = color
    ctx.globalAlpha = store.getTotalOpacity()
    ctx.fillRect(0, 0, width, height)

    store.map(this.makeBlot, this)

    ctx.restore()
  },

  makeBlot(blot) {
    let { ctx, height, width } = this.state
    let { x, y, radius } = blot

    ctx.save()
    ctx.globalAlpha = Equations.getBlotOpacity(blot)
    ctx.beginPath()

    if (this.props.recenter) {
      let size = Math.max(height, width)

      ctx.translate(Equations.getBlotShiftX(blot, size, width),
                    Equations.getBlotShiftY(blot, size, height))
    }

    ctx.arc(x, y, radius * Equations.getBlotScale(blot), 0, TAU)

    ctx.closePath()
    ctx.fill()
    ctx.restore()
  },

  componentWillUnmount() {
    this.state.store.stop()
  },

  pushBlot(timeStamp, clientX, clientY) {
    let el    = this.getDOMNode()
    let style = window.getComputedStyle(el)

    let { top, bottom, left, right } = el.getBoundingClientRect()

    let height = bottom - top
    let width  = right - left

    this.setState({
      color  : style.color,
      ctx    : this.state.ctx || this.refs.canvas.getDOMNode().getContext('2d'),
      height : height,
      width  : width
    }, () => {
      this.state.store.add({
        duration  : this.props.duration,
        opacity   : this.props.opacity,
        mouseDown : timeStamp,
        mouseUp   : 0,
        radius    : Math.min(Math.max(width, height), this.props.radius),
        x         : clientX - left,
        y         : clientY - top
      })
    })
  },

  popBlot(time) {
    this.state.store.release(time)
  },

  render() {
    let { height, width, touchEvents } = this.state

    let ratio = window.devicePixelRatio || 1

    return (
      <canvas ref="canvas"
              className="ink"
              style={{ ...STYLE, ...this.props.style }}
              height={ height * ratio }
              width={ width * ratio }
              onDragOver={ this._onRelease }
              { ...touchEvents } />
    )
  },

  _onPress(e) {
    let { button, ctrlKey, clientX, clientY, changedTouches } = e
    let timeStamp = Date.now()

    if (changedTouches) {
      for (var i = 0; i < changedTouches.length; i++) {
        let { clientX, clientY } = changedTouches[i]
        this.pushBlot(timeStamp, clientX, clientY)
      }
    } else if (button === MOUSE_LEFT && !ctrlKey) {
      this.pushBlot(timeStamp, clientX, clientY)
    }
  },

  _onRelease() {
    this.popBlot(Date.now())
  }
})

module.exports = Ink
