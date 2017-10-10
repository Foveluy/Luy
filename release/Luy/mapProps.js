'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mappingStrategy = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.mapProp = mapProp;

var _utils = require('./utils');

var _event = require('./event');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mapProp(domNode, props) {

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
    }
}

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
        domNode.__events = events;
        addEvent(document, dispatchEvent, eventName);
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
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(mapProp, 'mapProp', 'app/src/Luy/mapProps.js');

    __REACT_HOT_LOADER__.register(mappingStrategy, 'mappingStrategy', 'app/src/Luy/mapProps.js');

    __REACT_HOT_LOADER__.register(addEvent, 'addEvent', 'app/src/Luy/mapProps.js');

    __REACT_HOT_LOADER__.register(dispatchEvent, 'dispatchEvent', 'app/src/Luy/mapProps.js');

    __REACT_HOT_LOADER__.register(triggerEventByPath, 'triggerEventByPath', 'app/src/Luy/mapProps.js');

    __REACT_HOT_LOADER__.register(getEventPath, 'getEventPath', 'app/src/Luy/mapProps.js');
}();

;