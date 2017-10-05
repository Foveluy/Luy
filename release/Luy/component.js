'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactClass = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _vdom = require('./vdom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 用户用来继承的 Component 类
var ReactClass = function () {
  function ReactClass(props, context) {
    (0, _classCallCheck3.default)(this, ReactClass);

    this.props = props;
    this.context = context;
    this.state = this.state || {};

    this.nextState = null;
    this._renderCallbacks = [];
  }

  (0, _createClass3.default)(ReactClass, [{
    key: 'updateComponent',
    value: function updateComponent() {
      var prevState = this.state;
      var oldVnode = this.Vnode;

      if (this.nextState !== prevState) {
        this.state = this.nextState;
      }

      this.nextState = null;
      var newVnode = this.render();

      this.Vnode = (0, _vdom.update)(oldVnode, newVnode, this.dom); //这个函数返回一个新的Vnode
    }
  }, {
    key: 'setState',
    value: function setState(partialNewState, callback) {
      this.nextState = (0, _assign2.default)({}, this.state, partialNewState);
      this.updateComponent();
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {}
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {}
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {}
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {}
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {}
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}
  }, {
    key: 'componentDidUnmount',
    value: function componentDidUnmount() {}
  }, {
    key: 'render',
    value: function render() {}
  }]);
  return ReactClass;
}();

exports.ReactClass = ReactClass;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(ReactClass, 'ReactClass', 'app/src/Luy/component.js');
}();

;