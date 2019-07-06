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
  circle: {
    follow: 0,
    option: {
      size: 2
    },
    execute: function execute(startX, startY, endX, endY, size) {
      this.beginPath();
      this.arc(startX, startY, size, 0, 2 * Math.PI);
      this.fill();
    }
  },
  circle2: {
    follow: 0,
    option: {
      size: 2,
      follow: 2
    },
    execute: function execute(startX, startY, endX, endY, _ref) {
      var _ref$size = _ref.size,
          size = _ref$size === void 0 ? 2 : _ref$size,
          _ref$follow = _ref.follow,
          follow = _ref$follow === void 0 ? 2 : _ref$follow;
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
    _this.__afresh = true;
    _this.trackData = data || [];
    _this.style = {
      lineWidth: 2,
      fillStyle: "#333333",
      strokeStyle: "#333333",
      lineJoin: "round",
      lineCap: "round"
    };
    _this.startPiont = {
      x: 0,
      y: 0
    };
    _this.currentType = 'line';
    _this.tempTrack = [];
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

      if (this.currentType != 'line') {
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
    } // 设置画笔类型

  }, {
    key: "setType",
    value: function setType(value) {
      this.currentType = value;
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
},{"eventemitter3":"../node_modules/eventemitter3/index.js","./DrawStyle":"../src/DrawStyle.js","./utils":"../src/utils.js"}],"main.js":[function(require,module,exports) {
"use strict";

var _src = _interopRequireDefault(require("../src"));

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
  var gdt = ctx.createLinearGradient(0, 0, 800, 0);
  gdt.addColorStop(0, "rgba(255, 0, 0, 255)");
  gdt.addColorStop(0.1666, "rgba(255, 0, 255, 255)");
  gdt.addColorStop(0.3333, "rgba(0, 0, 255, 255)");
  gdt.addColorStop(0.5, "rgba(0, 255, 255, 255)");
  gdt.addColorStop(0.6666, "rgba(0, 255, 0, 255)");
  gdt.addColorStop(0.8333, "rgba(255, 255, 0, 255)");
  gdt.addColorStop(1, "rgba(255, 0, 0, 255)");
  return gdt;
};

var startDraw = function startDraw(evt) {
  var point = {
    x: evt.offsetX || evt.targetTouches[0].clientX,
    y: evt.offsetY || evt.targetTouches[0].clientY
  };

  if (point.y > 30) {
    ePaint.beginPoint(point);
    drawing = true;
  } else {
    var colorData = ctx.getImageData(point.x, point.y, 1, 1).data;
    var color = 'rgba(' + colorData[0] + ', ' + colorData[1] + ',' + colorData[2] + ', ' + colorData[3] + ')';
    ePaint.setLineStyle({
      fillStyle: color,
      strokeStyle: color
    });
    drawing = false;
  }
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
var ctx = createCtx(),
    ePaint = new _src.default([], ctx); // ePaint.setType('circle2')

ctx.fillStyle = createGradient();
ctx.fillRect(0, 0, 800, 30);
ctx.canvas.addEventListener('touchstart', startDraw);
ctx.canvas.addEventListener('touchmove', playDraw);
ctx.canvas.addEventListener('touchend', overDraw);
ctx.canvas.addEventListener('mousedown', startDraw);
ctx.canvas.addEventListener('mousemove', playDraw);
ctx.canvas.addEventListener('mouseup', overDraw);

window.loadData = function () {};

window.outData = function () {
  console.log(JSON.stringify(ePaint.data));
};

window.revoke = function () {};

window.clear = function () {};
},{"../src":"../src/index.js"}],"O:/Users/wangli/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49610" + '/');

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