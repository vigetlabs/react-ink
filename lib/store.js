/**
 * @name Ink Store
 * @desc Keeps track of changes to ripple epicenters
 * so that <Ink /> can focus on rendering them.
 */

var Equations = require('./equations');
var invariant = require('react/lib/invariant');

module.exports = function() {
  var _callbacks = [];
  var _data      = [];
  var _playing   = false;
  var _frame;

  var Store = {

    dispose() {
      _callbacks.length = 0;
      Store.stop();
    },

    publicize() {
      for (var i = 0, len = _callbacks.length; i < len; i++) {
        _callbacks[i]();
      }
    },

    subscribe(callback) {
      invariant(typeof callback === 'function', 'Ink.Store subscribe method expects a callback function');
      _callbacks.push(callback);
    },

    unsubscribe(callback) {
      var index = _callbacks.indexOf(callback);

      if (index > -1) {
        _callbacks.splice(index, 1);
      }
    },

    forEach(callback, scope) {
      return _data.forEach(callback, scope);
    },

    map(callback, scope) {
      return _data.map(callback, scope);
    },

    play() {
      if (!_playing) {
        _playing = true;
        Store.update();
      }
    },

    stop() {
      _playing = false;
      cancelAnimationFrame(_frame);
    },

    getTotalOpacity() {
      var opacity = 0;

      for (var i = 0, len = _data.length; i < len; i++) {
        opacity += _data[i].outerOpacity;
      }

      return opacity;
    },

    update() {
      for (var i = 0, len = _data.length; i < len; i++) {
        _data[i].opacity      = Equations.getBlotOpacity(_data[i]);
        _data[i].outerOpacity = Equations.getBlotOuterOpacity(_data[i]);
        _data[i].transform    = Equations.getBlotTransform(_data[i]);
      }

      Store.prune();
      Store.publicize();

      if (_data.length) {
        _frame = requestAnimationFrame(Store.update);
      } else {
        Store.stop();
      }
    },

    prune() {
      var i = 0;

      while (i < _data.length) {
        if (_data[i].opacity <= 0.01) {
          _data.splice(i, 1);
        } else {
          i++
        }
      }
    },

    add(props) {
      _data.push(props);
      Store.play();
    },

    release(now) {
      for (var i = 0, len = _data.length; i < len; i++) {
        _data[i].mouseUp = _data[i].mouseUp || now;
      }

      Store.play();
    }

  };

  return Store;
};
