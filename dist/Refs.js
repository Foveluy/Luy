'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setRef = setRef;

var _utils = require('./utils');

function setRef(Vnode, instance, domNode) {
    if (instance) {
        Vnode.owner = instance;
        var refType = (0, _utils.typeNumber)(Vnode.ref);
        if (refStrategy[refType]) {
            refStrategy[refType](Vnode, instance, domNode);
        }
    }
}

var refStrategy = {
    3: function _(Vnode, instance, domNode) {
        if (Vnode._instance) {
            // console.log(instance,Vnode.ref)
            instance.refs[Vnode.ref] = Vnode._instance;
        } else {
            instance.refs[Vnode.ref] = domNode;
        }
    },
    4: function _(Vnode, instance, domNode) {
        refStrategy[3](Vnode, instance, domNode);
    },
    5: function _(Vnode, instance, domNode) {
        if (Vnode._instance) {
            Vnode.ref(Vnode._instance);
        } else {
            Vnode.ref(domNode);
        }
    }
};