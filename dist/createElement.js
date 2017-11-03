'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Vnode = exports.createElement = undefined;
exports.flattenChildren = flattenChildren;

var _utils = require('./utils');

var _vdom = require('./vdom');

var RESERVED_PROPS = {
    ref: true,
    key: true,
    __self: true,
    __source: true
};

function Vnode(type, props, key, ref) {
    this.owner = _vdom.currentOwner.cur;
    this.type = type;
    this.props = props;
    this.key = key;
    this.ref = ref;
}

/**
 * 创建虚拟Dom的地方
 * @param {string | Function} type 
 * @param {object} config 
 * @param {array} children 
 */
function createElement(type, config) {
    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        children[_key - 2] = arguments[_key];
    }

    var props = {},
        key = null,
        ref = null,
        childLength = children.length;

    if (config != null) {
        //巧妙的将key转化为字符串
        key = config.key === undefined ? null : '' + config.key;
        ref = config.ref === undefined ? null : config.ref;

        /**这一步讲外部的prop属性放进prop里 */
        for (var propName in config) {
            // 除去一些不需要的属性,key,ref等
            if (RESERVED_PROPS.hasOwnProperty(propName)) continue;
            //保证所有的属性都不是undefined
            if (config.hasOwnProperty(propName)) {
                props[propName] = config[propName];
            }
        }
    }

    if (childLength === 1) {
        props.children = (0, _utils.typeNumber)(children[0]) > 2 ? children[0] : [];
    } else if (childLength > 1) {
        props.children = children;
    }

    /**设置defaultProps */
    var defaultProps = type.defaultProps;
    if (defaultProps) {
        for (var _propName in defaultProps) {
            if (props[_propName] === undefined) {
                props[_propName] = defaultProps[_propName];
            }
        }
    }

    return new Vnode(type, props, key, ref);
}

/**
 * 实际上这里做的事情就是将文字节点全部转换成Vnode
 * @param {*} children 
 */
function flattenChildren(children) {

    if (children === undefined) return new Vnode('#text', "", null, null);

    var length = children.length;
    var ary = [],
        isLastSimple = false,
        //判断上一个元素是否是string 或者 number
    lastString = '',
        childType = (0, _utils.typeNumber)(children);

    if (childType === 4 || childType === 3) {
        return new Vnode('#text', children, null, null);
    }

    if (childType !== 7) return children;

    children.forEach(function (item, index) {
        if ((0, _utils.typeNumber)(item) === 7) {
            if (isLastSimple) {
                ary.push(lastString);
            }
            item.forEach(function (item) {
                ary.push(item);
            });
            lastString = '';
            isLastSimple = false;
        }
        if ((0, _utils.typeNumber)(item) === 3 || (0, _utils.typeNumber)(item) === 4) {
            lastString += item;
            isLastSimple = true;
        }
        if ((0, _utils.typeNumber)(item) !== 3 && (0, _utils.typeNumber)(item) !== 4 && (0, _utils.typeNumber)(item) !== 7) {
            if (isLastSimple) {
                //上一个节点是简单节点
                ary.push(lastString);
                ary.push(item);
                lastString = '';
                isLastSimple = false;
            } else {
                ary.push(item);
            }
        }
        if (length - 1 === index) {
            if (lastString) ary.push(lastString);
        }
    });
    ary = ary.map(function (item) {
        if ((0, _utils.typeNumber)(item) === 4) {
            item = new Vnode('#text', item, null, null);
        }
        return item;
    });

    return ary;
}

exports.createElement = createElement;
exports.Vnode = Vnode;