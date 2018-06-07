/**
 * Ink
 * Fills a container with an SVG object that provides feedback on mouse/touch
 * events with a rippling pool.
 */

let HAS_TOUCH = require('./util/hasTouch')
let MOUSE_LEFT = 0
let pixelRatio = require('./util/pixelRatio')
let React = require('react')
let STYLE = require('./style')
let Store = require('./util/store')
let TAU = Math.PI * 2
let Equations = require('./util/equations')

class Ink extends React.PureComponent {
  static defaultProps = {
    background: true,
    className: 'ink',
    duration: 1000,
    opacity: 0.25,
    radius: 150,
    recenter: true,
    hasTouch: HAS_TOUCH
  }

  constructor(props) {
    super(...arguments)

    this.state = {
      color: 'transparent',
      density: 1,
      height: 0,
      store: Store(this.tick),
      touchEvents: this.touchEvents(),
      width: 0
    }
  }

  touchEvents() {
    if (this.props.hasTouch) {
      return {
        onTouchStart: this._onPress,
        onTouchEnd: this._onRelease,
        onTouchCancel: this._onRelease
      }
    } else {
      return {
        onMouseDown: this._onPress,
        onMouseUp: this._onRelease,
        onMouseLeave: this._onRelease
      }
    }
  }

  tick = () => {
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

    ctx.globalAlpha = Equations.getBlotOpacity(blot, this.props.opacity)
    ctx.beginPath()

    if (this.props.recenter) {
      let size = Math.max(height, width)

      x += Equations.getBlotShiftX(blot, size, width)
      y += Equations.getBlotShiftY(blot, size, height)
    }

    ctx.arc(x, y, radius * Equations.getBlotScale(blot), 0, TAU)

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
    let radius = Equations.getMaxRadius(height, width, this.props.radius)

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
    let { className, density, height, width, touchEvents } = this.state

    return (
      <canvas
        className={className}
        ref={this.setCanvas.bind(this)}
        style={{ ...STYLE, ...this.props.style }}
        height={height * density}
        width={width * density}
        onDragOver={this._onRelease}
        {...touchEvents}
      />
    )
  }

  _onPress = e => {
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
  }

  _onRelease = () => {
    this.state.store.release(Date.now())
  }
}

module.exports = Ink
