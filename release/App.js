'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Luy = require('./Luy');

var _Luy2 = _interopRequireDefault(_Luy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var a = [1, 2, 3, 4, 5];

var C = function (_React$Component) {
  (0, _inherits3.default)(C, _React$Component);

  function C() {
    (0, _classCallCheck3.default)(this, C);
    return (0, _possibleConstructorReturn3.default)(this, (C.__proto__ || (0, _getPrototypeOf2.default)(C)).apply(this, arguments));
  }

  (0, _createClass3.default)(C, [{
    key: 'render',
    value: function render() {
      return _Luy2.default.createElement(
        'div',
        null,
        'asd'
      );
    }
  }]);
  return C;
}(_Luy2.default.Component);

var App = function (_React$Component2) {
  (0, _inherits3.default)(App, _React$Component2);

  function App(props) {
    (0, _classCallCheck3.default)(this, App);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (App.__proto__ || (0, _getPrototypeOf2.default)(App)).call(this, props));

    _this2.state = {
      counter: 2
      // setInterval(() => {
      //   this.setState({ counter: this.state.counter + 1 })
      // }, 1500)
      // 
    };return _this2;
  }

  (0, _createClass3.default)(App, [{
    key: 'render',
    value: function render() {

      return _Luy2.default.createElement(
        'div',
        { key: 1, style: { background: 'rgb(99,99,' + (this.state.counter + 1) + ')' } },
        'fz'
      );
    }
  }]);
  return App;
}(_Luy2.default.Component);

var _default = App;
exports.default = _default;


_Luy2.default.render(_Luy2.default.createElement(App, null), document.getElementById('root'));
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(a, 'a', 'app/src/app.js');

  __REACT_HOT_LOADER__.register(C, 'C', 'app/src/app.js');

  __REACT_HOT_LOADER__.register(App, 'App', 'app/src/app.js');

  __REACT_HOT_LOADER__.register(_default, 'default', 'app/src/app.js');
}();

;