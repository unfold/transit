'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = createContainer;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodashCollectionAll = require('lodash/collection/all');

var _lodashCollectionAll2 = _interopRequireDefault(_lodashCollectionAll);

var _lodashObjectAssign = require('lodash/object/assign');

var _lodashObjectAssign2 = _interopRequireDefault(_lodashObjectAssign);

var _lodashCollectionMap = require('lodash/collection/map');

var _lodashCollectionMap2 = _interopRequireDefault(_lodashCollectionMap);

var _lodashCollectionForEach = require('lodash/collection/forEach');

var _lodashCollectionForEach2 = _interopRequireDefault(_lodashCollectionForEach);

var _reactLibShallowEqual = require('react/lib/shallowEqual');

var _reactLibShallowEqual2 = _interopRequireDefault(_reactLibShallowEqual);

var _transitions = require('./transitions');

var transitionTypes = _interopRequireWildcard(_transitions);

function createContainer(Component, getTarget) {
  var ContainerComponent = (function (_React$Component) {
    function ContainerComponent(props) {
      _classCallCheck(this, ContainerComponent);

      _React$Component.call(this, props);

      this.state = {};
      this.target = {};

      this.transitions = {};
    }

    _inherits(ContainerComponent, _React$Component);

    ContainerComponent.prototype.getChildContext = function getChildContext() {
      return {
        updateTarget: this.updateTarget.bind(this)
      };
    };

    ContainerComponent.prototype.isLeaving = function isLeaving() {
      return !!this.props.leaveCallback;
    };

    ContainerComponent.prototype.leave = function leave() {
      var _this = this;

      _lodashCollectionForEach2['default'](this.transitions, function (transition, key) {
        var target = _this.target.leave && _this.target.leave[key];

        if (target !== undefined) {
          transition.set(target.value);
        }
      });
    };

    ContainerComponent.prototype.cancelLeave = function cancelLeave() {
      var _this2 = this;

      _lodashCollectionForEach2['default'](this.transitions, function (transition, key) {
        var target = _this2.target.state && _this2.target.state[key];

        if (target !== undefined) {
          transition.set(target.value);
        }
      });
    };

    ContainerComponent.prototype.onTransitionUpdate = function onTransitionUpdate(key, value) {
      var _setState;

      this.setState((_setState = {}, _setState[key] = value, _setState));
    };

    ContainerComponent.prototype.onTransitionRest = function onTransitionRest() {
      if (this.isLeaving()) {
        var resting = _lodashCollectionMap2['default'](this.transitions, function (transition) {
          return transition.resting;
        });

        if (_lodashCollectionAll2['default'](resting)) {
          this.props.leaveCallback();
        }
      }
    };

    ContainerComponent.prototype.updateTarget = function updateTarget() {
      var _this3 = this;

      if (this.isLeaving()) {
        return;
      }

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      this.target = getTarget.call.apply(getTarget, [null].concat(args));

      _lodashCollectionForEach2['default'](this.target.state, function (params, key) {
        var transition = _this3.transitions[key];

        if (!transition) {
          var enterTarget = _this3.target.enter && _this3.target.enter[key];
          var TransitionType = transitionTypes[params.transition.type];

          transition = new TransitionType(_lodashObjectAssign2['default']({
            onUpdate: _this3.onTransitionUpdate.bind(_this3, key),
            onRest: _this3.onTransitionRest.bind(_this3, key)
          }, params.transition));

          if (enterTarget) {
            transition.position = enterTarget.value;
          }

          _this3.transitions[key] = transition;
        }

        transition.set(params.value);
      });
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

    ContainerComponent.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
      return !_reactLibShallowEqual2['default'](this.state, nextState) || !_reactLibShallowEqual2['default'](this.props, nextProps);
    };

    ContainerComponent.prototype.render = function render() {
      return _react2['default'].createElement(Component, _extends({}, this.props, { transit: this.state }));
    };

    return ContainerComponent;
  })(_react2['default'].Component);

  ContainerComponent.childContextTypes = {
    updateTarget: _react2['default'].PropTypes.func.isRequired
  };

  return ContainerComponent;
}

module.exports = exports['default'];