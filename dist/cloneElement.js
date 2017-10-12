'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.cloneElement = cloneElement;

var _createElement = require('./createElement');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cloneElement(vnode, props) {
    var config = void 0,
        children = void 0;
    for (var propName in vnode.props) {
        if (propName === 'children') {
            children = vnode.props[propName];
        } else {
            config[propName] = vnode.props[propName];
        }
    }
    config = (0, _extends3.default)({}, config, props);

    var newKey = props.key ? props.key : vnode.key;
    var newRef = props.ref ? props.ref : vnode.ref;
    config['key'] = newKey;
    config['ref'] = newRef;

    return (0, _createElement.createElement)(vnode.type, config, children);
}