module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Ink
	 * Fills a container with an SVG object that provides feedback on mouse/touch
	 * events with a rippling pool.
	 */

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var HAS_TOUCH = __webpack_require__(1);
	var MOUSE_LEFT = 0;
	var pixelRatio = __webpack_require__(2);
	var React = __webpack_require__(3);
	var STYLE = __webpack_require__(4);
	var Store = __webpack_require__(5);
	var Types = React.PropTypes;
	var TAU = Math.PI * 2;
	var Equations = __webpack_require__(6);
	var Pure = __webpack_require__(8);

	var Ink = React.createClass({
	  displayName: 'Ink',

	  shouldComponentUpdate: Pure,

	  propTypes: {
	    background: Types.bool,
	    duration: Types.number,
	    opacity: Types.number,
	    radius: Types.number,
	    recenter: Types.bool,
	    hasTouch: Types.bool
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      background: true,
	      duration: 1000,
	      opacity: 0.25,
	      radius: 150,
	      recenter: true,
	      hasTouch: HAS_TOUCH
	    };
	  },

	  getInitialState: function getInitialState() {
	    return {
	      color: 'transparent',
	      density: 1,
	      height: 0,
	      store: Store(this.tick),
	      touchEvents: this.touchEvents(),
	      width: 0
	    };
	  },

	  touchEvents: function touchEvents() {
	    if (this.props.hasTouch) {
	      return {
	        onTouchStart: this._onPress,
	        onTouchEnd: this._onRelease,
	        onTouchCancel: this._onRelease,
	        onTouchLeave: this._onRelease
	      };
	    } else {
	      return {
	        onMouseDown: this._onPress,
	        onMouseUp: this._onRelease,
	        onMouseLeave: this._onRelease
	      };
	    }
	  },

	  tick: function tick() {
	    var _state = this.state;
	    var ctx = _state.ctx;
	    var color = _state.color;
	    var density = _state.density;
	    var height = _state.height;
	    var width = _state.width;
	    var store = _state.store;

	    ctx.save();

	    ctx.scale(density, density);

	    ctx.clearRect(0, 0, width, height);

	    ctx.fillStyle = color;

	    if (this.props.background) {
	      ctx.globalAlpha = store.getTotalOpacity(this.props.opacity);
	      ctx.fillRect(0, 0, width, height);
	    }

	    store.each(this.makeBlot, this);

	    ctx.restore();
	  },

	  makeBlot: function makeBlot(blot) {
	    var _state2 = this.state;
	    var ctx = _state2.ctx;
	    var height = _state2.height;
	    var width = _state2.width;
	    var x = blot.x;
	    var y = blot.y;
	    var radius = blot.radius;

	    ctx.globalAlpha = Equations.getBlotOpacity(blot, this.props.opacity);
	    ctx.beginPath();

	    if (this.props.recenter) {
	      var size = Math.max(height, width);

	      x += Equations.getBlotShiftX(blot, size, width);
	      y += Equations.getBlotShiftY(blot, size, height);
	    }

	    ctx.arc(x, y, radius * Equations.getBlotScale(blot), 0, TAU);

	    ctx.closePath();
	    ctx.fill();
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    this.state.store.stop();
	  },

	  pushBlot: function pushBlot(timeStamp, clientX, clientY) {
	    var _this = this;

	    var el = this.refs.canvas;

	    // 0.13 support
	    if (el instanceof window.HTMLCanvasElement === false) {
	      el = el.getDOMNode();
	    }

	    var _el$getBoundingClientRect = el.getBoundingClientRect();

	    var top = _el$getBoundingClientRect.top;
	    var bottom = _el$getBoundingClientRect.bottom;
	    var left = _el$getBoundingClientRect.left;
	    var right = _el$getBoundingClientRect.right;

	    //let { color }                    = '#FFFFFF'; //window.getComputedStyle(el)

	    var ctx = this.state.ctx || el.getContext('2d');
	    var density = pixelRatio(ctx);
	    var height = bottom - top;
	    var width = right - left;
	    var radius = this.props.radius;
	    if (this.props.radius === Ink.getDefaultProps().radius) radius = Equations.getMaxRadius(height, width, this.props.radius);

	    this.setState({ ctx: ctx, density: density, height: height, width: width }, function () {
	      _this.state.store.add({
	        duration: _this.props.duration,
	        mouseDown: timeStamp,
	        mouseUp: 0,
	        radius: radius,
	        x: clientX - left,
	        y: clientY - top
	      });
	    });
	  },

	  render: function render() {
	    var _state3 = this.state;
	    var density = _state3.density;
	    var height = _state3.height;
	    var width = _state3.width;
	    var touchEvents = _state3.touchEvents;

	    return React.createElement('canvas', _extends({ className: 'ink',
	      ref: 'canvas',
	      style: _extends({}, STYLE, this.props.style),
	      height: height * density,
	      width: width * density,
	      onDragOver: this._onRelease
	    }, touchEvents));
	  },

	  _onPress: function _onPress(e) {
	    var button = e.button;
	    var ctrlKey = e.ctrlKey;
	    var clientX = e.clientX;
	    var clientY = e.clientY;
	    var changedTouches = e.changedTouches;

	    var timeStamp = Date.now();

	    if (changedTouches) {
	      for (var i = 0; i < changedTouches.length; i++) {
	        var _changedTouches$i = changedTouches[i];
	        var _clientX = _changedTouches$i.clientX;
	        var _clientY = _changedTouches$i.clientY;

	        this.pushBlot(timeStamp, _clientX, _clientY);
	      }
	    } else if (button === MOUSE_LEFT && !ctrlKey) {
	      this.pushBlot(timeStamp, clientX, clientY);
	    }
	  },

	  _onRelease: function _onRelease() {
	    this.state.store.release(Date.now());
	  }
	});

	module.exports = Ink;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	var bool = false;

	if (typeof window !== 'undefined') {
	  bool = 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch;
	}

	module.exports = bool;

/***/ },
/* 2 */
/***/ function(module, exports) {

	// Good stuff here:
	// http://www.html5rocks.com/en/tutorials/canvas/hidpi/

	"use strict";

	exports.__esModule = true;

	exports["default"] = function (context) {
	                        var devicePixelRatio = window.devicePixelRatio || 1;
	                        var backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;

	                        return devicePixelRatio / backingStoreRatio;
	};

	module.exports = exports["default"];

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  borderRadius: "inherit",
	  height: "100%",
	  left: 0,
	  position: "absolute",
	  top: 0,
	  width: "100%"
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Ink Store
	 * Keeps track of changes to ripple epicenters
	 * so that <Ink /> can focus on rendering them.
	 */

	'use strict';

	var Equations = __webpack_require__(6);

	var killStale = function killStale(_ref) {
	  var mouseUp = _ref.mouseUp;
	  var duration = _ref.duration;
	  return !mouseUp || Date.now() - mouseUp < duration;
	};

	module.exports = function (publicize) {
	  var _data = [];
	  var _playing = false;
	  var _frame = undefined;

	  var Store = {

	    each: function each(callback, scope) {
	      for (var i = 0, l = _data.length; i < l; i++) {
	        callback.call(scope, _data[i]);
	      }
	    },

	    play: function play() {
	      if (!_playing) {
	        _playing = true;
	        Store.update();
	      }
	    },

	    stop: function stop() {
	      _playing = false;
	      cancelAnimationFrame(_frame);
	    },

	    getTotalOpacity: function getTotalOpacity(opacity) {
	      var answer = 0;

	      for (var i = 0, l = _data.length; i < l; i++) {
	        answer += Equations.getBlotOuterOpacity(_data[i], opacity);
	      }

	      return answer;
	    },

	    update: function update() {
	      _data = _data.filter(killStale);

	      if (_data.length) {
	        _frame = requestAnimationFrame(Store.update);
	        publicize();
	      } else {
	        Store.stop();
	      }
	    },

	    add: function add(props) {
	      _data.push(props);
	      Store.play();
	    },

	    release: function release(time) {
	      for (var i = _data.length - 1; i >= 0; i--) {
	        if (!_data[i].mouseUp) {
	          return _data[i].mouseUp = time;
	        }
	      }
	    }

	  };

	  return Store;
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var easing = __webpack_require__(7);
	var SQRT_2 = Math.sqrt(2);
	var cos = Math.cos;
	var max = Math.max;
	var min = Math.min;

	function getPress(blot) {
	  return min(blot.duration, Date.now() - blot.mouseDown);
	}

	function getRelease(blot) {
	  return blot.mouseUp > 0 ? Date.now() - blot.mouseUp : 0;
	}

	function getRadius(blot) {
	  var duration = blot.duration;
	  var radius = blot.radius;

	  var down = easing(getPress(blot), 0, radius, duration) * 0.85;
	  var up = easing(getRelease(blot), 0, radius, duration) * 0.15;
	  var undulation = radius * 0.02 * cos(Date.now() / duration);

	  return max(0, down + up + undulation);
	}

	module.exports = {

	  getMaxRadius: function getMaxRadius(height, width, radius) {
	    return min(max(height, width) * 0.5, radius);
	  },

	  getBlotOpacity: function getBlotOpacity(blot, opacity) {
	    return easing(getRelease(blot), opacity, -opacity, blot.duration);
	  },

	  getBlotOuterOpacity: function getBlotOuterOpacity(blot, opacity) {
	    return min(this.getBlotOpacity(blot, opacity), easing(getPress(blot), 0, 0.3, blot.duration * 3));
	  },

	  getBlotShiftX: function getBlotShiftX(blot, size, width) {
	    return min(1, getRadius(blot) / size * 2 / SQRT_2) * (width / 2 - blot.x);
	  },

	  getBlotShiftY: function getBlotShiftY(blot, size, height) {
	    return min(1, getRadius(blot) / size * 2 / SQRT_2) * (height / 2 - blot.y);
	  },

	  getBlotScale: function getBlotScale(blot) {
	    return getRadius(blot) / blot.radius;
	  }
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	/**
	 * @t is the current time (or position) of the tween. This can be seconds or frames, steps, seconds, ms, whatever – as long as the unit is the same as is used for the total time [3].
	 * @b is the beginning value of the property.
	 * @c is the change between the beginning and destination value of the property.
	 * @d is the total time of the tween.
	 */

	"use strict";

	module.exports = function easeOutQuint(t, b, c, d) {
	  return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	exports["default"] = Pure;

	function Pure(props, state) {
	  for (var p in props) {
	    if (this.props[p] !== props[p]) return true;
	  }

	  for (var s in state) {
	    if (this.state[s] !== state[s]) return true;
	  }

	  return false;
	}

	module.exports = exports["default"];

/***/ }
/******/ ]);