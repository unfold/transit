'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashObjectAssign = require('lodash/object/assign');

var _lodashObjectAssign2 = _interopRequireDefault(_lodashObjectAssign);

var _lodashObjectDefaults = require('lodash/object/defaults');

var _lodashObjectDefaults2 = _interopRequireDefault(_lodashObjectDefaults);

var Spring = (function () {
  function Spring(params) {
    _classCallCheck(this, Spring);

    this.params = _lodashObjectDefaults2['default'](params || {}, {
      stiffness: 0.9,
      friction: 0.3,
      mass: 10,
      restThreshold: 0.001
    });

    this.acceleration = 0;
    this.position = 0;
    this.target = 0;
    this.velocity = 0;

    this.step = this.step.bind(this);

    this.scheduleStep();
  }

  Spring.prototype.scheduleStep = function scheduleStep() {
    var _params = this.params;
    var onUpdate = _params.onUpdate;
    var onRest = _params.onRest;

    if (!this.shouldRest()) {
      this.resting = false;
      requestAnimationFrame(this.step);
    } else {
      this.resting = true;
      this.position = this.target;

      onUpdate && onUpdate(this.position);
      onRest && onRest();
    }
  };

  Spring.prototype.set = function set(value) {
    this.target = value;

    if (this.resting) {
      this.scheduleStep();
    }
  };

  Spring.prototype.step = function step() {
    var onUpdate = this.params.onUpdate;
    var params = this.params;

    var now = new Date().getTime();
    var deltaTime = now - (this.time || now);

    var force = params.stiffness * (this.target - this.position);

    this.acceleration += (force / params.mass - this.acceleration) * (1 - params.friction);

    this.velocity += this.acceleration;

    this.velocity *= 1 - params.friction;

    this.position += this.velocity;

    this.time = now;

    onUpdate && onUpdate(this.position);

    this.scheduleStep();
  };

  Spring.prototype.shouldRest = function shouldRest() {
    var threshold = this.params.restThreshold;

    return Math.abs(this.velocity) < threshold && Math.abs(this.target - this.position) < threshold;
  };

  return Spring;
})();

exports['default'] = Spring;
module.exports = exports['default'];