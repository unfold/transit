'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = createContainer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodashCollectionAll = require('lodash/collection/all');

var _lodashCollectionAll2 = _interopRequireDefault(_lodashCollectionAll);

var _lodashCollectionMap = require('lodash/collection/map');

var _lodashCollectionMap2 = _interopRequireDefault(_lodashCollectionMap);

var _lodashCollectionForEach = require('lodash/collection/forEach');

var _lodashCollectionForEach2 = _interopRequireDefault(_lodashCollectionForEach);

var _reactLibShallowEqual = require('react/lib/shallowEqual');

var _reactLibShallowEqual2 = _interopRequireDefault(_reactLibShallowEqual);

var _dynamicsSpring = require('./dynamics/Spring');

var _dynamicsSpring2 = _interopRequireDefault(_dynamicsSpring);

function createContainer(Component, getTarget, getEnterTarget, getLeaveTarget) {
  var ContainerComponent = (function (_React$Component) {
    function ContainerComponent(props) {
      _classCallCheck(this, ContainerComponent);

      _React$Component.call(this, props);

      this.springs = {};

      this.state = {};

      this.checkLeaveStatus = this.checkLeaveStatus.bind(this);
    }

    _inherits(ContainerComponent, _React$Component);

    ContainerComponent.prototype.checkLeaveStatus = function checkLeaveStatus() {
      var resting = _lodashCollectionMap2['default'](this.springs, function (spring) {
        return spring.resting;
      });

      if (_lodashCollectionAll2['default'](resting)) {
        this.props.leaveCallback();
      }
    };

    ContainerComponent.prototype.leave = function leave() {
      var _this = this;

      _lodashCollectionForEach2['default'](this.springs, function (spring, key) {
        var target = _this.leaveTarget[key];

        if (target !== undefined) {
          spring.set(target);
        }

        spring.on('rest', _this.checkLeaveStatus);
      });
    };

    ContainerComponent.prototype.cancelLeave = function cancelLeave() {
      var _this2 = this;

      _lodashCollectionForEach2['default'](this.springs, function (spring, key) {
        var target = _this2.target[key];

        if (target !== undefined) {
          spring.set(target);
        }

        spring.off('rest', _this2.checkLeaveStatus);
      });
    };

    ContainerComponent.prototype.getChildContext = function getChildContext() {
      return {
        update: this.update.bind(this)
      };
    };

    ContainerComponent.prototype.onRender = function onRender(state) {
      if (this.mounted) {
        this.setState(state);
      }
    };

    ContainerComponent.prototype.onSpringUpdate = function onSpringUpdate(key, value) {
      var _setState;

      this.setState((_setState = {}, _setState[key] = value, _setState));
    };

    ContainerComponent.prototype.componentDidMount = function componentDidMount() {
      this.mounted = true;
    };

    ContainerComponent.prototype.componentWillUnmount = function componentWillUnmount() {
      this.mounted = false;
    };

    ContainerComponent.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      var prevLeave = this.props.leaveCallback;
      var leave = nextProps.leaveCallback;

      if (leave !== prevLeave) {
        if (leave) {
          this.leave();
        } else {
          this.cancelLeave();
        }
      }
    };

    ContainerComponent.prototype.update = function update() {
      var _this3 = this;

      if (this.props.leaveCallback) {
        return;
      }

      var args = Array.prototype.slice.call(arguments);

      this.target = getTarget.apply(null, args);
      this.enterTarget = getEnterTarget.apply(null, args);
      this.leaveTarget = getLeaveTarget.apply(null, args);

      _lodashCollectionForEach2['default'](this.target, function (value, key) {
        var spring = _this3.springs[key];

        if (!spring) {
          var enterTarget = _this3.enterTarget[key];

          spring = _this3.springs[key] = new _dynamicsSpring2['default']();
          spring.on('update', _this3.onSpringUpdate.bind(_this3, key));

          if (enterTarget) {
            spring.position = enterTarget;
          }
        }

        spring.set(value);
      });
    };

    ContainerComponent.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
      return !_reactLibShallowEqual2['default'](this.state, nextState) || !_reactLibShallowEqual2['default'](this.props, nextProps);
    };

    ContainerComponent.prototype.render = function render() {
      return _react2['default'].createElement(Component, _extends({}, this.props, { transit: this.state }));
    };

    return ContainerComponent;
  })(_react2['default'].Component);

  ContainerComponent.childContextTypes = {
    update: _react2['default'].PropTypes.func.isRequired
  };

  return ContainerComponent;
}

module.exports = exports['default'];