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

  function C(props) {
    (0, _classCallCheck3.default)(this, C);

    var _this = (0, _possibleConstructorReturn3.default)(this, (C.__proto__ || (0, _getPrototypeOf2.default)(C)).call(this, props));

    _this.state = {
      c: 2
    };
    return _this;
  }

  (0, _createClass3.default)(C, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps, nextContext) {}
    // shouldComponentUpdate(nextProps) {
    //   return this.props.name !== nextProps.name
    // }

  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {

      console.log('更新结束:context测试', this.context.fuck);
    }
  }, {
    key: 'componentWillUnMount',
    value: function componentWillUnMount() {
      console.log('组件准备删除');
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      console.log('context测试', this.context.fuck);
    }
  }, {
    key: 'click',
    value: function click(e) {
      this.setState({
        c: this.state.c + 1
      });
      console.log('点击触发中：', this.refs);
    }
  }, {
    key: 'render',
    value: function render() {
      return _Luy2.default.createElement(
        'div',
        null,
        '\u5916\u90E8\u5C5E\u6027:',
        this.props.name,
        '->>>>',
        this.state.c,
        _Luy2.default.createElement(
          'div',
          { ref: 'fuck' },
          'context fuck:',
          this.context.fuck
        ),
        _Luy2.default.createElement(
          'div',
          null,
          'context shit:',
          this.context.shit
        ),
        _Luy2.default.createElement(
          'button',
          { onClick: this.click.bind(this) },
          '\u70B9\u6211C'
        )
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
      counter: 1
      // setInterval(() => {
      //   this.setState({ counter: this.state.counter + 1 })
      // }, 1500)
      // 
    };return _this2;
  }

  (0, _createClass3.default)(App, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        fuck: this.state.counter + 1,
        shit: 1
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      console.log('组件挂载');
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      console.log('将要挂载');
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      console.log('更新完毕');
    }
  }, {
    key: 'click',
    value: function click(e) {
      console.log(this.refs.haha);
      console.log('函数ref', this.button);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _Luy2.default.createElement(
        'div',
        { key: 1, ref: 'haha', style: { background: 'rgb(99,99,' + this.state.counter + ')' } },
        _Luy2.default.createElement(
          'div',
          { dangerouslySetInnerHTML: { __html: this.state.counter } },
          '111'
        ),
        _Luy2.default.createElement(C, { name: 1 }),
        _Luy2.default.createElement(
          'button',
          { ref: function ref(node) {
              _this3.button = node;
            }, onClick: this.click.bind(this) },
          '\u70B9\u6211'
        )
      );
    }
  }]);
  return App;
}(_Luy2.default.Component);

var _default = App;
exports.default = _default;


_Luy2.default.render(_Luy2.default.createElement(
  'div',
  null,
  _Luy2.default.createElement(App, { shit: 'shit' })
), document.getElementById('root'));
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