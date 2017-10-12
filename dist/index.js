'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createElement = require('./createElement');

var _cloneElement = require('./cloneElement');

var _Children = require('./Children');

var _vdom = require('./vdom');

var _component = require('./component');

var React = {
    findDOMNode: _vdom.findDOMNode,
    createElement: _createElement.createElement, /** babel的默认设置是调用createElement这个函数 */
    render: _vdom.render,
    cloneElement: _cloneElement.cloneElement,
    Children: _Children.Children,
    Component: _component.ReactClass
};
exports.default = React;