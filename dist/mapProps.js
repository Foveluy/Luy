'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mappingStrategy = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.mapProp = mapProp;
exports.updateProps = updateProps;

var _utils = require('./utils');

var _event = require('./event');

var _controlledComponent = require('./controlledComponent');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var formElement = {
    input: true,
    select: true,
    textarea: true
};

function isFormElement(domNode) {
    return formElement[domNode.type];
}

function mapProp(domNode, props, Vnode) {
    if (Vnode && typeof Vnode.type === 'function') {
        //如果是组件，则不要map他的props进来
        return;
    }
    if (isFormElement(domNode)) {
        (0, _controlledComponent.mapControlledElement)(domNode, props);
    }
    for (var name in props) {
        if (name === 'children') continue;
        if ((0, _utils.isEventName)(name)) {
            var eventName = name.slice(2).toLowerCase(); //
            mappingStrategy['event'](domNode, props[name], eventName);
            continue;
        }
        if (typeof mappingStrategy[name] === 'function') {
            mappingStrategy[name](domNode, props[name]);
        }
        if (mappingStrategy[name] === undefined) {
            mappingStrategy['otherProps'](domNode, props[name], name);
        }
    }
}

function updateProps(oldProps, newProps, hostNode) {
    for (var name in oldProps) {
        //修改原来有的属性
        if (name === 'children') continue;

        if (oldProps[name] !== newProps[name]) {
            mapProp(hostNode, newProps);
        }
    }

    var restProps = {};
    for (var newName in newProps) {
        //新增原来没有的属性
        if (!oldProps[newName]) {
            restProps[newName] = newProps[newName];
        }
    }
    mapProp(hostNode, restProps);
}

var registerdEvent = {};
var mappingStrategy = exports.mappingStrategy = {
    style: function style(domNode, _style) {
        if (_style !== undefined) {
            (0, _keys2.default)(_style).forEach(function (styleName) {
                domNode.style[styleName] = _style[styleName];
            });
        }
    },
    event: function event(domNode, eventCb, eventName) {
        var events = domNode.__events || {};
        events[eventName] = eventCb;

        domNode.__events = events; //用于triggerEventByPath中获取event
        if (!registerdEvent[eventName]) {
            //所有事件只注册一次
            registerdEvent[eventName] = 1;
            addEvent(document, dispatchEvent, eventName);
        }
    },
    className: function className(domNode, _className) {
        if (_className !== undefined) {
            domNode.className = _className;
        }
    },
    dangerouslySetInnerHTML: function dangerouslySetInnerHTML(domNode, html) {
        var oldhtml = domNode.innerHTML;
        if (html.__html !== oldhtml) {
            domNode.innerHTML = html.__html;
        }
    },
    otherProps: function otherProps(domNode, prop, propName) {
        if (prop && propName) {
            domNode[propName] = prop;
        }
    }
};

function addEvent(domNode, fn, eventName) {
    if (domNode.addEventListener) {
        domNode.addEventListener(eventName, fn, false);
    } else if (domNode.attachEvent) {
        domNode.attachEvent("on" + eventName, fn);
    }
}

function dispatchEvent(event, eventName, end) {
    var path = getEventPath(event, end);
    var E = new _event.SyntheticEvent(event);

    _utils.options.async = true;

    triggerEventByPath(E, path); //触发event默认以冒泡形式
    _utils.options.async = false;
    for (var dirty in _utils.options.dirtyComponent) {
        _utils.options.dirtyComponent[dirty].updateComponent();
    }
    _utils.options.dirtyComponent = {}; //清空
}

/**
 * 触发event默认以冒泡形式
 * 冒泡：从里到外
 * 捕获：从外到里
 * @param {array} path 
 */
function triggerEventByPath(e, path) {

    for (var i = 0; i < path.length; i++) {
        var events = path[i].__events;

        for (var eventName in events) {
            var fn = events[eventName];
            e.currentTarget = path[i];
            if (typeof fn === 'function') {

                fn.call(path[i], e); //触发回调函数默认以冒泡形式
            }
        }
    }
}

/**
 * 当触发event的时候，我们利用这个函数
 * 去寻找触发路径上有函数回调的路径
 * @param {event} event 
 */
function getEventPath(event, end) {
    var path = [];
    var pathEnd = end || document;
    var begin = event.target;

    while (1) {
        if (begin.__events) {
            path.push(begin);
        }
        begin = begin.parentNode; //迭代
        if (!begin) {
            break;
        }
    }
    return path;
}