/**
 * Ink
 *
 * Fills a container with an SVG object that provides feedback on mouse/touch
 * events with a rippling pool.
 */

var React   = require('react');
var Store   = require('./lib/store');
var now     = require('./lib/now');
var Pure    = require('./mixins/pure');
var InRange = require('./types/inRange');
var AtLeast = require('./types/atLeast');

var Types   = React.PropTypes;

var MOUSE_LEFT = 0;

var Ink = React.createClass({

  mixins: [ Pure ],

  propTypes: {
    background : Types.bool,
    duration   : AtLeast(0),
    opacity    : InRange(0, 1),
    radius     : AtLeast(0),
    recenter   : Types.bool
  },

  getDefaultProps() {
    return {
      background : true,
      duration   : 1500,
      opacity    : 0.2,
      radius     : 150,
      recenter   : true
    };
  },

  getInitialState() {
    return {
      store : Store()
    }
  },

  tick() {
    this.forceUpdate();
  },

  componentDidMount() {
    this.state.store.subscribe(this.tick);
  },

  componentWillUnmount() {
    this.state.store.dispose();
  },

  pushBlot(event) {
    var bounds = this.getDOMNode().getBoundingClientRect();
    var height = bounds.bottom - bounds.top;
    var width  = bounds.right - bounds.left;

    this.state.store.add({
      duration     : this.props.duration,
      maxOpacity   : this.props.opacity,
      mouseDown    : now(),
      mouseUp      : 0,
      radius       : Math.min(this.props.radius, Math.max(height, width)),
      recenter     : this.props.recenter,
      x            : event.clientX - bounds.left,
      y            : event.clientY - bounds.top,
      size         : Math.max(height, width),
      height       : height,
      width        : width
    });
  },

  popBlot() {
    this.state.store.release(now());
  },

  makeBlot(blot, i) {
    return (
      <circle key={ i } r={ blot.radius } opacity={ blot.opacity } transform={ blot.transform } />
    );
  },

  getBackdrop() {
    var opacity = this.props.background ? this.state.store.getTotalOpacity() : 0;
    return <rect width="100%" height="100%" opacity={ opacity } />;
  },

  render() {
    return (
      <svg className="ink"
           style={{ color: this.props.color }}
           onTouchStart={ this._onPress }
           onTouchEnd={ this._onRelease }
           onTouchCancel={ this._onRelease }
           onTouchLeave={ this._onRelease }
           onMouseDown={ this._onPress }
           onMouseUp={ this._onRelease }
           onMouseLeave={ this._onRelease }>
        { this.getBackdrop() }
      { this.state.store.map(this.makeBlot) }
      </svg>
    );
  },

  _onPress(e) {
    var { button, ctrlKey, touches } = e;

    if (touches) {
      for (var i = 0; i < touches.length; i++) {
        this.pushBlot(touches[i]);
      }
    } else if (button === MOUSE_LEFT && !ctrlKey) {
      this.pushBlot(e);
    }
  },

  _onRelease(e) {
    this.popBlot();
  }
});

module.exports = Ink;
