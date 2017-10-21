'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactClass = exports.Com = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _vdom = require('./vdom');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Com = exports.Com = {
  CREATE: 0, //创造节点
  MOUNT: 1, //节点已经挂载
  UPDATING: 2, //节点正在更新
  UPDATED: 3, //节点已经更新
  MOUNTTING: 4 //节点正在挂载


  // 用户用来继承的 Component 类
};
var ReactClass = function () {
  function ReactClass(props, context) {
    (0, _classCallCheck3.default)(this, ReactClass);

    this.props = props;
    this.context = context;
    this.state = this.state || {};

    this.nextState = null;
    this._renderCallbacks = [];
    this.lifeCycle = Com.CREATE;
    this.stateMergeQueue = [];
    this._penddingState = [];
    this.refs = {};
  }

  (0, _createClass3.default)(ReactClass, [{
    key: 'updateComponent',
    value: function updateComponent() {
      var _this = this;

      var prevState = this.state;
      var oldVnode = this.Vnode;
      var oldContext = this.context;

      this.nextState = this.state;
      this._penddingState.forEach(function (item) {
        if (typeof item === 'function') {
          _this.nextState = (0, _assign2.default)({}, _this.state, item.partialNewState(_this.nextState, _this.props));
        } else {
          _this.nextState = (0, _assign2.default)({}, _this.state, item.partialNewState);
        }
      });

      if (this.nextState !== prevState) {
        this.state = this.nextState;
      }
      if (this.getChildContext) {
        this.context = (0, _utils.extend)((0, _utils.extend)({}, this.context), this.getChildContext());
      }

      if (this.componentWillUpdate) {
        this.componentWillUpdate(this.props, this.nextState, this.context);
      }
      this.nextState = null;
      var newVnode = this.render();

      this.Vnode = (0, _vdom.update)(oldVnode, newVnode, this.dom, this.context); //这个函数返回一个更新后的Vnode

      if (this.componentDidUpdate) {
        this.componentDidUpdate(this.props, prevState, oldContext);
      }

      this._penddingState.forEach(function (item) {
        if (typeof item.callback === 'function') {
          item.callback(_this.state, _this.props);
        }
      });

      this._penddingState = [];
    }
  }, {
    key: '_updateInLifeCycle',
    value: function _updateInLifeCycle() {
      if (this.stateMergeQueue.length > 0) {
        var tempState = this.state;
        this._penddingState.forEach(function (item) {
          tempState = _assign2.default.apply(Object, [{}, tempState].concat((0, _toConsumableArray3.default)(item.partialNewState)));
        });
        this.nextState = (0, _extends3.default)({}, tempState);
        this.stateMergeQueue = [];
        this.updateComponent();
      }
    }

    /**
     * 事件触发的时候setState只会触发最后一个
     * 在componentdidmount的时候会全部合成
     * @param {*} partialNewState 
     * @param {*} callback 
     */

  }, {
    key: 'setState',
    value: function setState(partialNewState, callback) {

      this._penddingState.push({ partialNewState: partialNewState, callback: callback });

      if (this.shouldComponentUpdate) {
        var shouldUpdate = this.shouldComponentUpdate(this.props, this.nextState, this.context);
        if (!shouldUpdate) {
          return;
        }
      }

      if (this.lifeCycle === Com.CREATE) {
        //组件挂载期

      } else {
        //组件更新期
        if (this.lifeCycle === Com.MOUNTTING) {
          //componentDidMount的时候调用setState
          this.stateMergeQueue.push(1);
          return;
        }

        if (_utils.options.async === true) {
          //事件中调用
          var dirty = _utils.options.dirtyComponent[this];
          if (!dirty) {
            _utils.options.dirtyComponent[this] = this;
          }
          return;
        }

        //不在生命周期中调用，有可能是异步调用
        this.updateComponent();
      }
    }

    // shouldComponentUpdate() { }

  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {}
    // componentWillUpdate() { }
    // componentDidUpdate() { }

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