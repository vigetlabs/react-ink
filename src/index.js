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
let now        = require('./util/now')
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

  pushBlot(clientX, clientY) {
    let rect = this.state.rect || this.getDOMNode().getBoundingClientRect()

    let { top, bottom, left, right } = rect

    let height = bottom - top
    let width  = right - left
    let size   = Math.max(height, width)

    this.state.store.add({
      duration   : this.props.duration,
      maxOpacity : this.props.opacity,
      mouseDown  : now(),
      mouseUp    : 0,
      radius     : Math.min(size, this.props.radius),
      recenter   : this.props.recenter,
      x          : clientX - left,
      y          : clientY - top,
      size       : size,
      height     : height,
      width      : width
    })

    if (!this.state.rect) {
      this.setState({ rect })
    }
  },

  popBlot() {
    this.state.store.release(now())
  },

  makeBlot({ radius, opacity, transform }, key) {
    return <circle key={ key } r={ radius } opacity={ opacity } transform={ transform } />
  },

  getBackdrop() {
    return <rect width="100%" height="100%" opacity={ this.state.store.getTotalOpacity() } />
  },

  render() {
    let { background, fill, style } = this.props
    let { store, touchEvents } = this.state
    let css = { ...STYLE, ...style }

    return (
      <svg className="ink" style={ css } fill={ fill } { ...touchEvents } onDragOver={ this._onRelease }>
        { store.map(this.makeBlot) }
        { background && this.getBackdrop() }
      </svg>
    )
  },

  _onPress(e) {
    let { button, ctrlKey, touches } = e

    if (touches) {
      let presses = Array.prototype.slice.call(touches, 0).map(i => [i.clientX, i.clientY])

      requestAnimationFrame(e => {
        presses.forEach(touch => this.pushBlot.apply(this, touch))
      })
    } else if (button === MOUSE_LEFT && !ctrlKey) {
      let { clientX, clientY } = e
      requestAnimationFrame(() => this.pushBlot(clientX, clientY))
    }
  },

  _onRelease() {
    requestAnimationFrame(this.popBlot)
  }
})

module.exports = Ink
