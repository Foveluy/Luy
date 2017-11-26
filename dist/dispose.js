'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.disposeVnode = disposeVnode;

var _utils = require('./utils');

var _Refs = require('./Refs');

function disposeVnode(Vnode) {
    //主要用于删除Vnode对应的节点
    var type = Vnode.type,
        props = Vnode.props;

    if (!type) return;
    if (typeof Vnode.type === 'function') {
        if (Vnode._instance.componentWillUnMount) {
            Vnode._instance.componentWillUnMount();
        }

        (0, _Refs.clearRefs)(Vnode._instance.ref);
    }
    if (Vnode.props.children) {
        disposeChildVnode(Vnode.props.children);
    }
    if (Vnode._PortalHostNode) {
        var parent = Vnode._PortalHostNode.parentNode;
        parent.removeChild(Vnode._PortalHostNode);
    } else {
        if (Vnode._hostNode) {
            //有可能会出现undefind的情况
            var _parent = Vnode._hostNode.parentNode;
            _parent.removeChild(Vnode._hostNode);
        }
    }
    Vnode._hostNode = null;
}

function disposeChildVnode(childVnode) {
    var children = childVnode;
    if ((0, _utils.typeNumber)(children) !== 7) children = [children];
    children.forEach(function (child) {
        if (typeof child.type === 'function') {
            if (child._instance.componentWillUnMount) {
                child._instance.componentWillUnMount();
            }
        }
        child._hostNode = null;
        child._instance = null;
        if (child.props.children) {
            disposeChildVnode(child.props.children);
        }
    });
}