'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodashArrayXor = require('lodash/array/xor');

var _lodashArrayXor2 = _interopRequireDefault(_lodashArrayXor);

var _lodashArrayDifference = require('lodash/array/difference');

var _lodashArrayDifference2 = _interopRequireDefault(_lodashArrayDifference);

var _lodashFunctionDebounce = require('lodash/function/debounce');

var _lodashFunctionDebounce2 = _interopRequireDefault(_lodashFunctionDebounce);

var _lodashObjectValues = require('lodash/object/values');

var _lodashObjectValues2 = _interopRequireDefault(_lodashObjectValues);

var TransitionComponent = (function (_React$Component) {
  function TransitionComponent(props) {
    _classCallCheck(this, TransitionComponent);

    _React$Component.call(this, props);

    this.children = {};
    this.leaving = {};

    this.applyChildren(props.children);

    this.childLeaveFinished = _lodashFunctionDebounce2['default'](this.childLeaveFinished, 1);
  }

  _inherits(TransitionComponent, _React$Component);

  TransitionComponent.prototype.childLeaveCallback = function childLeaveCallback(key) {
    if (!!this.leaving[key]) {
      delete this.children[key];
      delete this.leaving[key];

      this.childLeaveFinished();
    }
  };

  TransitionComponent.prototype.childLeaveFinished = function childLeaveFinished() {
    this.forceUpdate();
  };

  TransitionComponent.prototype.applyChildren = function applyChildren(children) {
    var _this = this;

    var prevKeys = Object.keys(this.children);
    var nextKeys = children.map(function (child) {
      return child.key;
    });

    var leaving = _lodashArrayDifference2['default'](prevKeys, nextKeys);

    _react2['default'].Children.forEach(children, function (child) {
      _this.children[child.key] = child;
    });

    this.leaving = leaving;
  };

  TransitionComponent.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (this.shouldComponentUpdate(nextProps)) {
      this.applyChildren(nextProps.children || []);
    }
  };

  TransitionComponent.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    var prev = (this.props.children || []).map(function (child) {
      return child.key;
    });
    var next = (nextProps.children || []).map(function (child) {
      return child.key;
    });

    return !!_lodashArrayXor2['default'](prev, next).length;
  };

  TransitionComponent.prototype.render = function render() {
    var _this2 = this;

    var children = _react2['default'].Children.map(_lodashObjectValues2['default'](this.children), function (child) {
      return _react2['default'].cloneElement(child, {
        leaveCallback: _this2.leaving[child.key] && _this2.childLeaveCallback.bind(_this2, child.key)
      });
    });

    return _react2['default'].createElement(
      'div',
      null,
      children
    );
  };

  return TransitionComponent;
})(_react2['default'].Component);

exports['default'] = TransitionComponent;
module.exports = exports['default'];