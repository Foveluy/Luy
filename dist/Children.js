'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Children = undefined;

var _createElement = require('./createElement');

var _utils = require('./utils');

var Children = exports.Children = {
    //context不是组件的context而是组件上下文
    map: function map(childVnode, callback, context) {
        if (childVnode === null || childVnode === undefined) {
            return childVnode;
        }

        var ret = [];
        (0, _createElement.flattenChildren)(childVnode).forEach(function (oldVnode, index) {
            var newVnode = callback.call(context, oldVnode, index);
            if (newVnode === null) {
                return;
            }
            ret.push(newVnode);
        });
        return ret;
    },
    only: function only(childVnode) {
        if ((0, _utils.typeNumber)(childVnode) !== 7) {
            return childVnode;
        }
        throw new Error("React.Children.only expect only one child, which means you cannot use a list inside a component");
    },
    count: function count(childVnode) {
        if (childVnode === null) {
            return 0;
        }
        if ((0, _utils.typeNumber)(childVnode) !== 7) {
            return 1;
        }
        return (0, _createElement.flattenChildren)(childVnode).length;
    },
    forEach: function forEach(childVnode, callback, context) {
        (0, _createElement.flattenChildren)(childVnode).forEach(callback, context);
    },


    toArray: function toArray(childVnode) {
        if (childVnode == null) {
            return [];
        }
        return Children.map(childVnode, function (el) {
            return el;
        });
    }

};