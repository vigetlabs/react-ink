/**
 * Ink
 *
 * Fills a container with an SVG object that provides feedback on mouse/touch
 * events with a rippling pool.
 */

let HAS_TOUCH  = require('./util/hasTouch')
let React      = require('react')
let STYLE      = require('./style')
let Store      = require('./util/store')
let MOUSE_LEFT = 0
let Types      = React.PropTypes

let Ink = React.createClass({

  shouldComponentUpdate(props, state) {
    return !!state.frame
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
      fill       : 'currentColor',
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

  tick(frame) {
    this.setState({ frame })
  },

  componentWillUnmount() {
    this.state.store.stop()
  },

  pushBlot(timeStamp, clientX, clientY) {
    let { top, bottom, left, right }  = this.getDOMNode().getBoundingClientRect()

    let height = bottom - top
    let width  = right - left
    let size   = Math.max(height, width)

    this.state.store.add({
      duration   : this.props.duration,
      maxOpacity : this.props.opacity,
      mouseDown  : timeStamp,
      mouseUp    : 0,
      radius     : Math.min(size, this.props.radius),
      recenter   : this.props.recenter,
      x          : clientX - left,
      y          : clientY - top,
      size       : size,
      height     : height,
      width      : width
    })
  },

  popBlot(time) {
    this.state.store.release(time)
  },

  makeBlot({ radius:r, opacity:fillOpacity, transform }, key) {
    return React.createElement('circle', { key, r, fillOpacity, transform })
  },

  render() {
    let { background, fill, style } = this.props
    let { store, touchEvents } = this.state
    let css = { ...STYLE, ...style }

    return (
      <svg className="ink" style={ css } fill={ fill } { ...touchEvents } onDragOver={ this._onRelease }>
        { store.map(this.makeBlot) }
        <rect width="100%" height="100%" fillOpacity={ background ? this.state.store.getTotalOpacity() : 0 } />
      </svg>
    )
  },

  _onPress(e) {
    let { button, ctrlKey, clientX, clientY, changedTouches, timeStamp } = e

    if (changedTouches) {
      for (var i = 0; i < changedTouches.length; i++) {
        let { clientX, clientY } = changedTouches[i]
        this.pushBlot(timeStamp, clientX, clientY)
      }
    } else if (button === MOUSE_LEFT && !ctrlKey) {
      this.pushBlot(timeStamp, clientX, clientY)
    }
  },

  _onRelease({ timeStamp }) {
    this.popBlot(timeStamp)
  }
})

module.exports = Ink
