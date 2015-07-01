'use strict';

exports.__esModule = true;
exports['default'] = normalizeTarget;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashObjectAssign = require('lodash/object/assign');

var _lodashObjectAssign2 = _interopRequireDefault(_lodashObjectAssign);

var _lodashObjectTransform = require('lodash/object/transform');

var _lodashObjectTransform2 = _interopRequireDefault(_lodashObjectTransform);

function visitValue(value, transition) {
  return { value: value, transition: transition };
}

function visitObject(object, parentTransition, label) {
  if (parentTransition === undefined) parentTransition = {};

  var transition = object.transition;
  var replaceTransition = transition && transition.type && transition.type !== parentTransition.type;
  var nextTransition = replaceTransition ? transition : _lodashObjectAssign2['default']({}, parentTransition, transition);

  return _lodashObjectTransform2['default'](object, function (result, value, key) {
    if (key === 'value') {
      result[key] = value;
      result.transition = nextTransition;
    } else if (typeof value === 'number') {
      result[key] = visitValue(value, nextTransition);
    } else if (key !== 'transition') {
      result[key] = visitObject(value, nextTransition, label ? label + '.' + key : key);
    }
  });
}

function normalizeTarget(target) {
  return visitObject(target);
}

module.exports = exports['default'];