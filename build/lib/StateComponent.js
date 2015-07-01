'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodashObjectOmit = require('lodash/object/omit');

var _lodashObjectOmit2 = _interopRequireDefault(_lodashObjectOmit);

var _reactLibShallowEqual = require('react/lib/shallowEqual');

var _reactLibShallowEqual2 = _interopRequireDefault(_reactLibShallowEqual);

var StateComponent = (function (_React$Component) {
  function StateComponent(props, context) {
    _classCallCheck(this, StateComponent);

    _React$Component.call(this, props);

    this.updateTarget = context.updateTarget;
  }

  _inherits(StateComponent, _React$Component);

  StateComponent.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var propsWithoutChildren = _lodashObjectOmit2['default'](this.props, 'children');
    var nextPropsWithoutChildren = _lodashObjectOmit2['default'](nextProps, 'children');

    if (!_reactLibShallowEqual2['default'](propsWithoutChildren, nextPropsWithoutChildren)) {
      this.updateTarget(nextProps);
    }
  };

  StateComponent.prototype.componentDidMount = function componentDidMount() {
    this.updateTarget(this.props);
  };

  StateComponent.prototype.render = function render() {
    return _react2['default'].createElement('div', { children: this.props.children });
  };

  return StateComponent;
})(_react2['default'].Component);

exports['default'] = StateComponent;

StateComponent.contextTypes = {
  updateTarget: _react2['default'].PropTypes.func.isRequired
};
module.exports = exports['default'];