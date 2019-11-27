// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/eventemitter3/index.js":[function(require,module,exports) {
'use strict';

var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}

},{}],"../src/DrawStyle.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  line: {
    follow: 0,
    option: {},
    execute: function execute(startX, startY, endX, endY) {
      this.beginPath();
      this.moveTo(startX, startY);
      this.lineTo(endX, endY);
      this.stroke();
    }
  },
  rect: {
    isline: false,
    option: {},
    execute: function execute(startX, startY, endX, endY) {
      this.beginPath();
      this.rect(startX, startY, endX - startX, endY - startY);
      this.stroke();
    }
  },
  trian: {
    isline: false,
    option: {
      size: 3
    },
    execute: function execute(startX, startY, endX, endY) {
      var width = endX - startX;
      var height = endY - startY;
      this.beginPath();
      this.moveTo(startX, startY);
      this.lineTo(startX - width, startY + height);
      this.lineTo(endX, endY);
      this.closePath();
      this.stroke();
    }
  },
  circleline: {
    follow: 10,
    option: {
      size: 3
    },
    execute: function execute(startX, startY, endX, endY, _ref) {
      var size = _ref.size;
      this.beginPath();
      this.arc(startX, startY, size, 0, 2 * Math.PI);
      this.fill();
    }
  },
  circle: {
    isline: false,
    option: {
      size: 3
    },
    execute: function execute(startX, startY, endX, endY) {
      var size = Math.abs(endX - startX);
      this.beginPath();
      this.arc(startX, startY, size, 0, 2 * Math.PI);
      this.closePath();
      this.stroke();
    }
  },
  ellipse: {
    isline: false,
    option: {
      size: 3
    },
    execute: function execute(startX, startY, endX, endY) {
      var w = endX - startX,
          h = endY - startY,
          x = startX,
          y = startY;
      var k = 0.5522848;
      var ox = w / 2 * k,
          oy = h / 2 * k,
          xe = x + w,
          ye = y + h,
          xm = x + w / 2,
          ym = y + h / 2;
      this.beginPath();
      this.moveTo(x, ym);
      this.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
      this.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
      this.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
      this.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
      this.closePath();
      this.stroke(); // var width = endX - startX, height = endY - startY;
      // var k = (width / 0.75) / 2, w = width / 2, h = height / 2;
      // this.beginPath();
      // this.moveTo(startX, startY - h);
      // this.bezierCurveTo(startX + k, startY - h, startX + k, startY + h, startX, startY + h);
      // this.bezierCurveTo(startX - k, startY + h, startX - k, startY - h, startX, startY - h);
      // this.closePath();
      // this.stroke();
    }
  },
  circle2: {
    follow: 16,
    option: {
      size: 2,
      follow: 2
    },
    execute: function execute(startX, startY, endX, endY, _ref2) {
      var _ref2$size = _ref2.size,
          size = _ref2$size === void 0 ? 2 : _ref2$size,
          _ref2$follow = _ref2.follow,
          follow = _ref2$follow === void 0 ? 2 : _ref2$follow;
      var radian = Math.atan2(endY - startY, endX - startX);
      var place = 0;
      var dist = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

      while (dist > 2) {
        var end2X = startX + place * Math.cos(radian);
        var end2Y = startY + place * Math.sin(radian);
        var w = end2X - endX;
        var h = end2Y - endY;
        dist = Math.sqrt(w * w + h * h);
        this.beginPath();
        this.arc(end2X, end2Y, size, 0, 2 * Math.PI);
        this.fill();
        place += follow;
      }
    }
  }
};
exports.default = _default;
},{}],"../src/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDist = getDist;

function getDist(x, y, x2, y2) {
  var w = x2 - x,
      h = y2 - y;
  return Math.sqrt(w * w + h * h);
}
},{}],"../src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eventemitter = _interopRequireDefault(require("eventemitter3"));

var _DrawStyle = _interopRequireDefault(require("./DrawStyle"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * 2019/4/15
 * wangli
 * v0.1.2
 */
//画布尺寸
var size = {
  width: 5120,
  height: 2880 //创建一个画布对象

};

var createCanvas = function createCanvas() {
  var cvs = document.createElement('canvas');
  cvs.id = 'cvs' + new Date().getTime() + "" + parseInt(100 + Math.random() * 100);
  cvs.width = size.width;
  cvs.height = size.height;
  return cvs;
};

var EPaint =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(EPaint, _EventEmitter);

  /**
   * 构建线条实例
   * @param {object} data 初始化数据 
   * @param {object} ctx getContext 2d对象 
   * @param {objcet} style 默认样式颜色
   */
  function EPaint(data, ctx, style) {
    var _this;

    _classCallCheck(this, EPaint);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EPaint).call(this));
    _this.__afresh = true; // 是否绘制连续线条

    _this.isline = true; // 绘制的路径

    _this.trackData = data || []; // 默认样式

    _this.style = {
      lineWidth: 2,
      fillStyle: "#333333",
      strokeStyle: "#333333",
      lineJoin: "round",
      lineCap: "round" // 当前开始位置

    };
    _this.startPiont = {
      x: 0,
      y: 0 // 绘制类型

    };
    _this.currentType = 'line'; // 临时路径

    _this.tempTrack = []; // 清楚画布的数据

    _this.clearData = [];
    _this.ctx = ctx || createCanvas().getContext("2d");
    if (style) Object.assign(_this.style, style);
    Object.assign(_this.ctx, _this.style);
    return _this;
  }
  /**
   * 划线样式
   * @param {objcet} style 
   */


  _createClass(EPaint, [{
    key: "setLineStyle",
    value: function setLineStyle(style) {
      Object.assign(this.style, style);
      Object.assign(this.ctx, this.style);
    }
    /**
     * 开始绘画位置
     * @param {point} track 
     *  {x:val,y:val}
     */

  }, {
    key: "beginPoint",
    value: function beginPoint(track) {
      this.tempTrack = Object.values(track);
      this.startPiont = track;
      this.isline = typeof _DrawStyle.default[this.currentType].isline == 'undefined' ? true : false;

      if (this.currentType != 'line' && this.isline) {
        this.drawPolygon({
          data: Object.values(track),
          type: this.currentType,
          style: this.style,
          option: _DrawStyle.default[this.currentType].option
        });
        this.update();
      }
    }
    /**
     * 绘画当前位置坐标
     * @param {point} track 
     */

  }, {
    key: "movePoint",
    value: function movePoint(track) {
      var x = this.startPiont.x,
          y = this.startPiont.y,
          x2 = track.x,
          y2 = track.y;

      if (this.isline) {
        if ((0, _utils.getDist)(x, y, x2, y2) > (_DrawStyle.default[this.currentType].follow || 0)) {
          var _this$tempTrack;

          // 移动绘制的跟随间隔距离
          (_this$tempTrack = this.tempTrack).push.apply(_this$tempTrack, _toConsumableArray(Object.values(track)));

          this.drawPolygon({
            data: [x, y, x2, y2],
            type: this.currentType,
            style: this.style,
            option: _DrawStyle.default[this.currentType].option
          });
          this.startPiont = track;
          this.update();
        }
      } else {
        this.drawHistory();
        this.tempTrack[2] = x2;
        this.tempTrack[3] = y2;
        this.drawPolygon({
          data: [x, y, x2, y2],
          type: this.currentType,
          style: this.style,
          option: _DrawStyle.default[this.currentType].option
        });
        this.update();
      }
    }
    /**
     * 结束当前绘画路径
     */

  }, {
    key: "trackOver",
    value: function trackOver() {
      // 保存路径数据
      this.trackData.push({
        action: "drawing",
        type: this.currentType,
        style: Object.assign({}, this.style),
        data: _toConsumableArray(this.tempTrack),
        option: _DrawStyle.default[this.currentType].option
      });
      this.update();
    }
    /**
     * 清除位置（橡皮路径）
     * @param {rect} rect 
     */

  }, {
    key: "clear",
    value: function clear(rect) {
      this.clearData.push(rect.x, rect.y, rect.width, rect.height);
      this.clearPolygon([rect.x, rect.y, rect.width, rect.height]);
      this.update();
    } //结束橡皮路径()

  }, {
    key: "clearOver",
    value: function clearOver() {
      this.trackData.push({
        action: "clearRect",
        data: _toConsumableArray(this.clearData)
      });
      this.clearData = [];
      this.update();
    }
    /**
     * 清空画布重新绘制历史纪录
     */

  }, {
    key: "drawHistory",
    value: function drawHistory() {
      // 清空画布重新绘制
      this.ctx.clearRect(0, 0, size.width, size.height);

      for (var key in this.trackData) {
        switch (this.trackData[key].action) {
          case 'drawing':
            this.drawPolygon(this.trackData[key]);
            break;

          case 'clearRect':
            this.clearPolygon(this.trackData[key].data);
            break;
        }
      }

      this.update();
    }
    /**
     * 绘制数据
     * @param {array} track 
     * @param {string} style 
     */

  }, {
    key: "drawPolygon",
    value: function drawPolygon(value) {
      var track = value.data,
          type = value.type || 'line',
          startX = track[0],
          startY = track[1],
          option = value.option || {};
      Object.assign(this.ctx, value.style);

      if (_DrawStyle.default[type]) {
        try {
          for (var i = 2, lg = track.length; i < lg; i += 2) {
            var endX = track[i],
                endY = track[i + 1];

            _DrawStyle.default[type].execute.call(this.ctx, startX, startY, endX, endY, option);

            startX = endX, startY = endY;
          }
        } catch (error) {
          console.warn(error);
        }
      }
    } // 清除路径

  }, {
    key: "clearPolygon",
    value: function clearPolygon(track) {
      for (var i = 0, lg = track.length; i < lg; i += 4) {
        this.ctx.clearRect(track[i], track[i + 1], track[i + 2], track[i + 3]);
      }
    }
    /**
     * 撤销，后退
     */

  }, {
    key: "revoke",
    value: function revoke() {
      this.trackData.pop();
      this.tempTrack = [];
      this.clearData = [];
      this.drawHistory();
    }
    /**
     * 设置绘图数据
     * @param {array} value 
     */

  }, {
    key: "setData",
    value: function setData(value) {
      this.trackData = value;
      this.drawHistory();
    }
    /**
     * 设置画笔类型
     * @param {string} value 
     * @param {object} develop 
     * 切换画笔，同时也是临时扩展画笔
     */

  }, {
    key: "setType",
    value: function setType(value, develop) {
      this.currentType = value;
      if (develop) Object.assign(_DrawStyle.default, _defineProperty({}, value, develop));
    }
  }, {
    key: "update",
    value: function update() {
      this.emit('update', this);
    }
  }, {
    key: "canvas",
    get: function get() {
      return this.ctx.canvas;
    }
  }, {
    key: "data",
    get: function get() {
      return this.trackData;
    }
  }]);

  return EPaint;
}(_eventemitter.default);

exports.default = EPaint;
},{"eventemitter3":"../node_modules/eventemitter3/index.js","./DrawStyle":"../src/DrawStyle.js","./utils":"../src/utils.js"}],"data.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = [{
  "action": "drawing",
  "type": "line",
  "style": {
    "lineWidth": 2,
    "fillStyle": "#333333",
    "strokeStyle": "#333333",
    "lineJoin": "round",
    "lineCap": "round"
  },
  "data": [731.5, 58.5],
  "option": {}
}, {
  "action": "drawing",
  "type": "line",
  "style": {
    "lineWidth": 2,
    "fillStyle": "rgba(255, 145,0, 255)",
    "strokeStyle": "rgba(255, 145,0, 255)",
    "lineJoin": "round",
    "lineCap": "round"
  },
  "data": [171, 183, 165.5, 198, 162.5, 203.5, 158.5, 208.5, 155, 214.5, 151.5, 221.5, 147, 229.5, 143, 238.5, 139, 249, 135, 260, 131, 271.5, 127, 283, 123.5, 294.5, 120.5, 305.5, 117.5, 316, 115.5, 325.5, 113.5, 334, 111.5, 340.5, 109.5, 346.5, 109, 351, 108, 354, 108, 355, 108.5, 355, 109, 354, 109, 352, 110, 349, 111.5, 344.5, 113, 337, 116.5, 327.5, 120, 315.5, 125, 302.5, 130.5, 288, 136.5, 273, 143, 257.5, 151, 242.5, 159.5, 228, 169.5, 213, 179.5, 199.5, 191, 186.5, 202.5, 175.5, 214.5, 165, 226.5, 156, 239, 149, 251, 143, 262, 139, 271.5, 136.5, 278.5, 135.5, 283.5, 136, 286.5, 138.5, 288, 142, 288, 147, 286, 153, 282.5, 161.5, 276.5, 171, 267.5, 182.5, 257, 195, 244.5, 208.5, 232, 221.5, 218, 234.5, 205.5, 246.5, 193.5, 256.5, 183.5, 265, 176, 271, 171, 275.5, 168.5, 277.5, 168, 278.5, 169.5, 278.5, 173.5, 277.5, 180.5, 275, 191, 269.5, 204, 264.5, 217.5, 257.5, 231, 250.5, 245, 242, 260, 234.5, 274, 226.5, 287, 219, 298, 212.5, 307, 206.5, 314, 202, 318.5, 198.5, 321.5, 196, 323, 194.5, 322, 195, 320.5, 196, 318.5, 197.5, 316.5, 199, 314.5, 200.5, 312, 202.5, 307.5, 205.5, 301.5, 209.5, 295.5, 214.5, 289.5, 219.5, 284, 225, 277.5, 231.5, 272, 239, 267, 247, 263.5, 256.5, 261, 264.5, 260, 272, 260, 279.5, 261, 285.5, 262.5, 290, 265, 293.5, 268, 296, 272, 297.5, 278.5, 297, 286.5, 295, 296, 291, 305.5, 285, 315, 277.5, 324, 269.5, 332, 261, 338.5, 252, 343.5, 244, 348, 236.5, 351, 230, 353, 225, 353.5, 221.5, 353, 220, 352.5, 219, 351.5, 220, 350, 221, 348, 223.5, 345, 228, 341.5, 233.5, 338, 240, 335, 247, 333, 254, 331, 261.5, 330.5, 268.5, 330.5, 275.5, 331.5, 281.5, 333.5, 286, 337.5, 289, 343.5, 291, 351, 290.5, 359.5, 288, 369.5, 283.5, 389, 272, 399.5, 264.5, 410.5, 256, 422, 247.5, 433, 239.5, 443.5, 231.5, 452.5, 225, 459, 220, 464, 216.5, 465.5, 214.5, 466, 213.5, 464.5, 214, 462, 215, 459, 216, 455.5, 217.5, 452.5, 219, 449.5, 220.5, 447.5, 222, 445, 223.5, 443, 226, 439.5, 228.5, 435.5, 232, 430.5, 236, 425.5, 240, 421.5, 243.5, 418, 247, 414.5, 250.5, 411, 254.5, 408, 257.5, 406, 261, 403.5, 264.5, 401.5, 269, 400, 274.5, 399.5, 280, 400, 286, 401, 291, 403, 295, 406, 298.5, 410, 302, 415, 303.5, 420, 303, 426.5, 301.5, 434, 297.5, 442, 292, 450.5, 283.5, 460, 274, 470, 262.5, 480.5, 250, 492, 234.5, 505.5, 217, 519, 199],
  "option": {}
}, {
  "action": "drawing",
  "type": "line",
  "style": {
    "lineWidth": 2,
    "fillStyle": "rgba(255, 145,0, 255)",
    "strokeStyle": "rgba(255, 145,0, 255)",
    "lineJoin": "round",
    "lineCap": "round"
  },
  "data": [566, 121, 547.5, 134.5, 540, 143.5, 532, 152.5, 523, 163.5, 514, 174, 505, 186, 495.5, 197.5, 487, 210, 479.5, 221.5, 473, 233, 468, 244, 464.5, 254, 463, 264, 462.5, 272, 463.5, 280, 465, 287, 466.5, 293, 469, 297.5, 472, 301, 475, 304, 478, 306.5, 481.5, 308, 485, 309, 489, 309.5, 495, 309, 502.5, 307, 511.5, 303.5, 522.5, 298, 535, 292, 547.5, 285.5, 560, 279, 571.5, 273, 581.5, 268.5, 590, 265, 597, 264],
  "option": {}
}, {
  "action": "drawing",
  "type": "line",
  "style": {
    "lineWidth": 2,
    "fillStyle": "rgba(255, 145,0, 255)",
    "strokeStyle": "rgba(255, 145,0, 255)",
    "lineJoin": "round",
    "lineCap": "round"
  },
  "data": [270, 394, 288.5, 393, 296, 391.5, 304, 390, 313, 387.5, 323, 384.5, 334.5, 381, 347.5, 377, 362, 373, 376, 369.5, 391, 365.5, 405, 362, 418, 358, 429.5, 355, 440, 353, 448.5, 351.5, 454, 350.5, 457, 350.5, 458, 351, 456.5, 352.5, 453, 355.5],
  "option": {}
}, {
  "action": "drawing",
  "type": "line",
  "style": {
    "lineWidth": 2,
    "fillStyle": "rgba(255, 145,0, 255)",
    "strokeStyle": "rgba(255, 145,0, 255)",
    "lineJoin": "round",
    "lineCap": "round"
  },
  "data": [180.5, 500, 198.5, 497.5, 207, 495.5, 216.5, 493.5, 228, 490.5, 240.5, 487, 255, 483.5, 270.5, 480, 287, 476, 305, 470.5, 324, 465, 345, 459, 367, 452.5, 390.5, 444.5, 415, 436.5, 440, 427, 466.5, 417, 495, 406, 523.5, 395.5, 550, 386, 575.5, 376.5, 600, 368.5, 624, 360.5, 646, 353, 666, 346, 685, 339.5, 700.5, 333, 713.5, 327.5, 722.5, 323, 729.5, 319.5, 733, 317.5, 734, 316, 733.5, 315.5, 732, 315.5, 730, 316.5, 729, 317.5, 727.5, 318.5, 726.5, 319.5, 725.5, 320.5, 725, 321.5, 724.5, 322.5, 724, 323, 723, 324.5],
  "option": {}
}, {
  "action": "drawing",
  "type": "line",
  "style": {
    "lineWidth": 2,
    "fillStyle": "rgba(255, 145,0, 255)",
    "strokeStyle": "rgba(255, 145,0, 255)",
    "lineJoin": "round",
    "lineCap": "round"
  },
  "data": [52, 54],
  "option": {}
}, {
  "action": "drawing",
  "type": "line",
  "style": {
    "lineWidth": 2,
    "fillStyle": "rgba(255, 0,85, 255)",
    "strokeStyle": "rgba(255, 0,85, 255)",
    "lineJoin": "round",
    "lineCap": "round"
  },
  "data": [576, 558, 567, 570.5, 565.5, 574, 564.5, 577, 564, 579.5, 563.5, 581.5, 564, 583.5, 565, 584.5, 567, 585, 570, 584.5, 574.5, 583.5, 580.5, 581, 587, 578, 592.5, 574.5, 597.5, 571, 601, 568, 604, 566, 605.5, 564.5, 606, 563, 605.5, 563, 604, 564.5, 602, 567, 598.5, 570.5, 595.5, 575, 592.5, 579, 589.5, 582.5, 588, 585, 587, 586.5, 586.5, 588, 587, 588.5, 588, 588.5, 589.5, 588, 591.5, 587, 594.5, 585.5, 597.5, 584, 601.5, 582.5, 605.5, 581, 610, 580, 613, 579.5, 615.5, 579.5, 617.5, 579.5, 618, 580.5, 618.5, 582, 618, 584, 617.5, 585.5, 617, 587, 616.5, 588, 616, 588.5, 616.5, 589, 617.5, 589, 620, 588.5, 624, 588.5, 629, 587.5, 634.5, 587, 640, 586.5, 645, 586.5, 649.5, 586.5, 653.5, 587, 657, 587.5, 660.5, 588, 663.5, 588.5, 667.5, 588.5, 676.5, 587, 690, 584, 708, 579.5],
  "option": {}
}, {
  "action": "drawing",
  "type": "line",
  "style": {
    "lineWidth": 2,
    "fillStyle": "rgba(255, 0,85, 255)",
    "strokeStyle": "rgba(255, 0,85, 255)",
    "lineJoin": "round",
    "lineCap": "round"
  },
  "data": [313, 51],
  "option": {}
}, {
  "action": "drawing",
  "type": "line",
  "style": {
    "lineWidth": 2,
    "fillStyle": "rgba(0, 74,255, 255)",
    "strokeStyle": "rgba(0, 74,255, 255)",
    "lineJoin": "round",
    "lineCap": "round"
  },
  "data": [60.5, 131, 76.5, 122, 82.5, 118, 89, 114, 95.5, 109.5, 102, 105, 109.5, 100.5, 116, 96, 123.5, 92, 128.5, 88, 133, 85.5, 135.5, 83.5, 137, 82.5, 135, 83.5, 131.5, 86.5, 126.5, 90.5, 121, 96.5, 115, 103, 108.5, 110.5, 102.5, 118.5, 97, 126.5, 91.5, 135, 86.5, 144.5, 82, 152.5, 78, 160, 75, 166.5, 73.5, 172.5, 72, 178, 72, 181.5, 72.5, 184.5, 74, 187, 75.5, 188, 77.5, 188.5, 80, 188.5, 82.5, 188, 85.5, 186, 89.5, 183.5, 93.5, 179.5, 98.5, 174, 104.5, 168.5, 110, 162, 115.5, 155.5, 121.5, 149, 128, 143, 135, 137, 141, 132.5, 146, 129, 150, 127, 153, 126.5, 154, 127, 153.5, 129.5, 151.5, 134, 148.5, 139.5, 144.5, 146, 139, 153, 134, 160, 129, 166.5, 125, 172, 122.5, 176, 121.5, 179, 121.5, 180.5, 123.5, 181, 127, 179.5, 132, 176.5, 137.5, 172.5, 144, 168.5, 151, 164.5, 157, 160.5, 161, 158, 164.5, 156, 167, 155.5, 168, 156.5, 168, 159, 167, 163, 164.5, 168.5, 162, 174.5, 159.5, 180, 157.5, 184.5, 157, 187.5, 157.5, 189, 160.5, 187.5, 166.5, 184.5, 174, 180.5, 182.5, 175, 191, 170.5, 199, 167.5, 205.5, 165.5, 211, 165.5, 215, 167.5, 217.5, 170.5, 218.5, 173.5, 220, 177, 222, 180.5, 224.5, 182.5, 228.5, 183, 235, 182, 242, 179, 249, 174, 256, 169, 263, 163.5, 268.5, 158.5, 273, 153.5, 276, 149, 277.5, 145.5, 278.5, 142.5, 278, 140.5, 277.5, 139],
  "option": {}
}, {
  "action": "drawing",
  "type": "line",
  "style": {
    "lineWidth": 2,
    "fillStyle": "rgba(0, 74,255, 255)",
    "strokeStyle": "rgba(0, 74,255, 255)",
    "lineJoin": "round",
    "lineCap": "round"
  },
  "data": [203, 141],
  "option": {}
}, {
  "action": "drawing",
  "type": "line",
  "style": {
    "lineWidth": 2,
    "fillStyle": "rgba(0, 74,255, 255)",
    "strokeStyle": "rgba(0, 74,255, 255)",
    "lineJoin": "round",
    "lineCap": "round"
  },
  "data": [195, 98],
  "option": {}
}, {
  "action": "drawing",
  "type": "line",
  "style": {
    "lineWidth": 2,
    "fillStyle": "rgba(0, 74,255, 255)",
    "strokeStyle": "rgba(0, 74,255, 255)",
    "lineJoin": "round",
    "lineCap": "round"
  },
  "data": [192.5, 142, 204, 155.5, 208.5, 160],
  "option": {}
}];
exports.default = _default;
},{}],"main.js":[function(require,module,exports) {
"use strict";

var _src = _interopRequireDefault(require("../src"));

var _data = _interopRequireDefault(require("./data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createCtx = function createCtx() {
  var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 800;
  var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 600;
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  document.body.appendChild(canvas);
  canvas.style.backgroundColor = '#ffffff';
  document.body.style.backgroundColor = '#f1f1f1';
  return canvas.getContext('2d');
};

var createGradient = function createGradient() {
  var gdt = ctx2.createLinearGradient(0, 0, 800, 0);
  gdt.addColorStop(0, "rgba(255, 0, 0, 255)");
  gdt.addColorStop(0.1666, "rgba(255, 0, 255, 255)");
  gdt.addColorStop(0.3333, "rgba(0, 0, 255, 255)");
  gdt.addColorStop(0.5, "rgba(0, 255, 255, 255)");
  gdt.addColorStop(0.6666, "rgba(0, 255, 0, 255)");
  gdt.addColorStop(0.8333, "rgba(255, 255, 0, 255)");
  gdt.addColorStop(1, "rgba(255, 0, 0, 255)");
  return gdt;
};

var colorBox = function colorBox(color) {
  var gdx = ctx2.createLinearGradient(740, 0, 800, 0);
  gdx.addColorStop(1, color);
  gdx.addColorStop(0, 'rgba(255,255,255,1)');
  ctx2.fillStyle = gdx;
  ctx2.fillRect(740, 0, 800, 50);
  var gdy = ctx2.createLinearGradient(740, 0, 740, 50);
  gdy.addColorStop(0, 'rgba(0,0,0,0)');
  gdy.addColorStop(1, 'rgba(0,0,0,1)');
  ctx2.fillStyle = gdy;
  ctx2.fillRect(740, 0, 800, 50);
};

var setcolor = function setcolor(evt) {
  var point = {
    x: evt.offsetX || evt.targetTouches[0].clientX,
    y: evt.offsetY || evt.targetTouches[0].clientY
  };
  var colorData = ctx2.getImageData(point.x, point.y, 1, 1).data;
  var color = 'rgba(' + colorData[0] + ', ' + colorData[1] + ',' + colorData[2] + ', ' + colorData[3] + ')';
  ePaint.setLineStyle({
    fillStyle: color,
    strokeStyle: color
  });

  if (point.x < 700) {
    colorBox(color);
  }
};

var startDraw = function startDraw(evt) {
  ePaint.beginPoint({
    x: evt.offsetX || evt.targetTouches[0].clientX,
    y: evt.offsetY || evt.targetTouches[0].clientY
  });
  drawing = true;
};

var playDraw = function playDraw(evt) {
  if (drawing) {
    ePaint.movePoint({
      x: evt.offsetX || evt.targetTouches[0].clientX,
      y: evt.offsetY || evt.targetTouches[0].clientY
    });
  }
};

var overDraw = function overDraw(evt) {
  if (drawing) ePaint.trackOver();
  drawing = false;
};

var drawing = false;
var ctx2 = createCtx(800, 50),
    ctx = createCtx(),
    ePaint = new _src.default([], ctx); // ePaint.setType('circle2')

ctx2.fillStyle = createGradient(ctx2);
ctx2.fillRect(0, 0, 700, 50);
ctx2.canvas.addEventListener('touchstart', setcolor);
ctx2.canvas.addEventListener('mousedown', setcolor);
colorBox('rgba(255,255,255,255)');
ctx.canvas.addEventListener('touchstart', startDraw);
ctx.canvas.addEventListener('touchmove', playDraw);
ctx.canvas.addEventListener('touchend', overDraw);
ctx.canvas.addEventListener('mousedown', startDraw);
ctx.canvas.addEventListener('mousemove', playDraw);
ctx.canvas.addEventListener('mouseup', overDraw);

window.loadData = function () {
  ePaint.setData(_data.default);
};

window.outData = function () {
  console.log(JSON.stringify(ePaint.data));
};

window.revoke = function () {
  ePaint.revoke();
};

window.penA = function () {
  ePaint.setType("line");
};

window.penB = function () {
  ePaint.setType("circleline");
};

window.drawRect = function () {
  ePaint.setType("rect");
};

window.drawTriant = function () {
  ePaint.setType("trian");
};

window.drawCircle = function () {
  ePaint.setType("circle");
};

window.drawEllipse = function () {
  ePaint.setType("ellipse");
};
},{"../src":"../src/index.js","./data":"data.js"}],"O:/Users/wangli/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53302" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["O:/Users/wangli/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map