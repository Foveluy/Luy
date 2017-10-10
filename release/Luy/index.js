'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createElement = require('./createElement');

var _vdom = require('./vdom');

var _component = require('./component');

var React = {
    findDOMNode: _vdom.findDOMNode,
    createElement: _createElement.createElement, /** babel的默认设置是调用createElement这个函数 */
    render: _vdom.render,
    Component: _component.ReactClass
};
var _default = React;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(React, 'React', 'app/src/Luy/index.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'app/src/Luy/index.js');
}();

;