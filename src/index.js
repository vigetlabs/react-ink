/**
 * Ink
 *
 * Fills a container with an SVG object that provides feedback on mouse/touch
 * events with a rippling pool.
 */

let React      = require('react')
let Store      = require('./util/store')
let now        = require('./util/now')
let HAS_TOUCH  = require('./util/hasTouch')
let Types      = React.PropTypes
let MOUSE_LEFT = 0

let Ink = React.createClass({

  shouldComponentUpdate(props, state) {
    return state.frame !== this.state.frame
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
      store : Store(this.tick)
    }
  },

  tick(frame) {
    this.setState({ frame})
  },

  componentWillUnmount() {
    this.state.store.stop()
  },

  pushBlot(event) {
    let { top, bottom, left, right } = this.getDOMNode().getBoundingClientRect()

    let height = bottom - top
    let width  = right - left
    let size   = Math.max(height, width)

    this.state.store.add({
      duration   : this.props.duration,
      maxOpacity : this.props.opacity,
      mouseDown  : now(),
      mouseUp    : 0,
      radius     : Math.min(this.props.radius, size),
      recenter   : this.props.recenter,
      x          : event.clientX - left,
      y          : event.clientY - top,
      size       : size,
      height     : height,
      width      : width
    })
  },

  popBlot() {
    this.state.store.release(now())
  },

  makeBlot({ radius, opacity, transform }, i) {
    return <circle key={ i } r={ radius } opacity={ opacity } transform={ transform } />
  },

  getBackdrop() {
    let opacity = this.props.background ? this.state.store.getTotalOpacity() : 0
    return <rect width="100%" height="100%" opacity={ opacity } />
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

  render() {
    return (
      <svg className="ink" style={ this.props.style } onDragOver={ this._onRelease } { ...this.touchEvents() }>
        { this.state.store.map(this.makeBlot) }
        { this.getBackdrop() }
      </svg>
    )
  },

  _onPress(e) {
    let { button, ctrlKey, touches } = e

    if (touches) {
      for (var i = 0, len = touches.length; i < len; i++) {
        this.pushBlot(touches[i])
      }
    } else if (button === MOUSE_LEFT && !ctrlKey) {
      this.pushBlot(e)
    }
  },

  _onRelease() {
    requestAnimationFrame(this.popBlot)
  }
})

module.exports = Ink
