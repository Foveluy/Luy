'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.currentOwner = undefined;
exports.createPortal = createPortal;
exports.update = update;
exports.findDOMNode = findDOMNode;
exports.render = render;

var _utils = require('./utils');

var _createElement = require('./createElement');

var _mapProps = require('./mapProps');

var _Refs = require('./Refs');

var _dispose = require('./dispose');

var _component = require('./component');

//Top Api
function createPortal(children, container) {
    var domNode = void 0;
    if (container) {
        if (Array.isArray(children)) {
            domNode = mountChild(children, container);
        } else {
            domNode = render(children, container);
        }
    } else {
        throw new Error('请给portal一个插入的目标');
    }
    //用于记录Portal的事物
    var CreatePortalVnode = new _createElement.Vnode('#text', "createPortal", null, null);
    CreatePortalVnode._PortalHostNode = container;
    return CreatePortalVnode;
}

var mountIndex = 0; //全局变量
var containerMap = {};
var currentOwner = exports.currentOwner = {
    cur: null
};

function instanceProps(componentVnode) {
    return {
        oldState: componentVnode._instance.state,
        oldProps: componentVnode._instance.props,
        oldContext: componentVnode._instance.context,
        oldVnode: componentVnode._instance.Vnode
    };
}

function mountIndexAdd() {
    return mountIndex++;
}

function updateText(oldTextVnode, newTextVnode, parentDomNode) {
    var dom = oldTextVnode._hostNode;
    if (oldTextVnode.props !== newTextVnode.props) {
        dom.nodeValue = newTextVnode.props;
    }
}

function updateChild(oldChild, newChild, parentDomNode, parentContext) {
    newChild = (0, _createElement.flattenChildren)(newChild);
    oldChild = oldChild || [];
    if (!Array.isArray(oldChild)) oldChild = [oldChild];
    if (!Array.isArray(newChild)) newChild = [newChild];

    var oldLength = oldChild.length,
        newLength = newChild.length,
        oldStartIndex = 0,
        newStartIndex = 0,
        oldEndIndex = oldLength - 1,
        newEndIndex = newLength - 1,
        oldStartVnode = oldChild[0],
        newStartVnode = newChild[0],
        oldEndVnode = oldChild[oldEndIndex],
        newEndVnode = newChild[newEndIndex],
        hascode = {};

    if (newLength >= 0 && !oldLength) {
        newChild.forEach(function (newVnode, index) {
            renderByLuy(newVnode, parentDomNode, false, parentContext);
            newChild[index] = newVnode;
        });
        return newChild;
    }
    if (!newLength && oldLength >= 0) {
        oldChild.forEach(function (oldVnode) {
            (0, _dispose.disposeVnode)(oldVnode);
        });
        return newChild[0];
    }

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (oldStartVnode === undefined || oldStartVnode === null) {
            oldStartVnode = oldChild[++oldStartIndex];
        } else if (oldEndVnode === undefined || oldEndVnode === null) {
            oldEndVnode = oldChild[--oldEndIndex];
        } else if (newStartVnode === undefined || newStartVnode === null) {
            newStartVnode = newChild[++newStartIndex];
        } else if (newEndVnode === undefined || newEndVnode === null) {
            newEndVnode = newChild[--newEndIndex];
        } else if ((0, _utils.isSameVnode)(oldStartVnode, newStartVnode)) {
            update(oldStartVnode, newStartVnode, newStartVnode._hostNode, parentContext);
            oldStartVnode = oldChild[++oldStartIndex];
            newStartVnode = newChild[++newStartIndex];
        } else if ((0, _utils.isSameVnode)(oldEndVnode, newEndVnode)) {
            update(oldEndVnode, newEndVnode, newEndVnode._hostNode, parentContext);
            oldEndVnode = oldChild[--oldEndIndex];
            newEndVnode = newChild[--newEndIndex];
        } else if ((0, _utils.isSameVnode)(oldStartVnode, newEndVnode)) {
            var dom = oldStartVnode._hostNode;
            parentDomNode.insertBefore(dom, oldEndVnode.nextSibling);
            update(oldStartVnode, newEndVnode, oldStartVnode._hostNode._hostNode, parentContext);
            oldStartVnode = oldChild[++oldStartIndex];
            newEndVnode = newChild[--newEndIndex];
        } else if ((0, _utils.isSameVnode)(oldEndVnode, newStartVnode)) {
            var _dom = oldEndVnode._hostNode;
            parentDomNode.insertBefore(_dom, oldStartVnode._hostNode);
            update(oldStartVnode, newEndVnode, oldStartVnode._hostNode, parentContext);
            oldEndVnode = oldChild[--oldEndIndex];
            newStartVnode = newChild[++newStartIndex];
        } else {
            if (hascode === undefined) hascode = (0, _utils.mapKeyToIndex)(oldChild);

            var indexInOld = hascode[newStartVnode.key];

            if (indexInOld === undefined) {
                var newElm = renderByLuy(newStartVnode, parentDomNode, true, parentContext);
                parentDomNode.insertBefore(newElm, oldStartVnode._hostNode);
                newStartVnode = newChild[++newStartIndex];
            } else {
                var moveVnode = oldChild[indexInOld];
                update(moveVnode, newStartVnode, moveVnode._hostNode, parentContext);
                parentDomNode.insertBefore(moveVnode._hostNode, oldStartVnode._hostNode);
                oldChild[indexInOld] = undefined;
                newStartVnode = newChild[++newStartIndex];
            }
        }
        if (oldStartIndex > oldEndIndex) {

            for (; newStartIndex - 1 < newEndIndex; newStartIndex++) {
                if (newChild[newStartIndex]) {
                    var newDomNode = renderByLuy(newChild[newStartIndex], parentDomNode, true, parentContext);
                    parentDomNode.appendChild(newDomNode);
                    // if (oldChild[oldChild.length - 1]) {

                    // } else {
                    //     parentDomNode.insertBefore(newDomNode, oldChild[oldChild.length - 1]._hostNode)
                    // }
                    newChild[newStartIndex]._hostNode = newDomNode;
                }
            }
        } else if (newStartIndex > newEndIndex) {
            for (; oldStartIndex - 1 < oldEndIndex; oldStartIndex++) {
                if (oldChild[oldStartIndex]) {
                    var removeNode = oldChild[oldStartIndex];
                    (0, _dispose.disposeVnode)(removeNode);
                }
            }
        }
    }
    return newChild;
}

/**
 * 当我们更新组件的时候，并不需要重新创建一个组件，而是拿到久的组件的props,state,context就可以进行重新render
 * 而且要注意的是，组件的更新并不需要比对或者交换state,因为组件的更新完全依靠外部的context和props
 * @param {*} oldComponentVnode 老的孩子组件，_instance里面有着这个组件的实例
 * @param {*} newComponentVnode 新的组件
 * @param {*} parentContext 父亲context
 * @param {*} parentDomNode 父亲节点
 */
function updateComponent(oldComponentVnode, newComponentVnode, parentContext, parentDomNode) {
    var _instanceProps = instanceProps(oldComponentVnode),
        oldState = _instanceProps.oldState,
        oldProps = _instanceProps.oldProps,
        oldContext = _instanceProps.oldContext,
        oldVnode = _instanceProps.oldVnode;

    var newProps = newComponentVnode.props;
    var newContext = parentContext;
    var instance = oldComponentVnode._instance;
    // const willReceive = oldContext !== newContext || oldProps !== newProps
    //如果props和context中的任意一个改变了，那么就会触发组件的receive,render,update等
    //但是依旧会继续往下比较

    //更新原来组件的信息
    oldComponentVnode._instance.props = newProps;

    if (instance.getChildContext) {
        oldComponentVnode._instance.context = (0, _utils.extend)((0, _utils.extend)({}, newContext), instance.getChildContext());
    } else {
        oldComponentVnode._instance.context = (0, _utils.extend)({}, newContext);
    }

    oldComponentVnode._instance.lifeCycle = _component.Com.UPDATING;
    if (oldComponentVnode._instance.componentWillReceiveProps) {
        oldComponentVnode._instance.componentWillReceiveProps(newProps, newContext);
        var mergedState = oldComponentVnode._instance.state;
        oldComponentVnode._instance._penddingState.forEach(function (partialState) {
            mergedState = (0, _utils.extend)((0, _utils.extend)({}, mergedState), partialState.partialNewState);
        });
        oldComponentVnode._instance.state = mergedState;
    }

    if (oldComponentVnode._instance.shouldComponentUpdate) {
        var shouldUpdate = oldComponentVnode._instance.shouldComponentUpdate(newProps, oldState, newContext);
        if (!shouldUpdate) {
            //无论shouldComponentUpdate结果是如何，数据都会给用户设置上去
            //但是不一定会刷新
            oldComponentVnode._instance.props = newProps;
            oldComponentVnode._instance.context = newContext;
            return;
        }
    }

    if (oldComponentVnode._instance.componentWillUpdate) {
        oldComponentVnode._instance.componentWillUpdate(newProps, oldState, newContext);
    }

    var lastOwner = currentOwner.cur;
    currentOwner.cur = oldComponentVnode._instance;

    var newVnode = oldComponentVnode._instance.render ? oldComponentVnode._instance.render() : new newComponentVnode.type(newProps, newContext);
    newVnode = newVnode ? newVnode : new _createElement.Vnode('#text', "", null, null);
    var fixedOldVnode = oldVnode ? oldVnode : oldComponentVnode._instance;

    currentOwner.cur = lastOwner;

    var willUpdate = _utils.options.dirtyComponent[oldComponentVnode._instance._uniqueId]; //因为用react-redux更新的时候
    if (willUpdate) {
        delete _utils.options.dirtyComponent[oldComponentVnode._instance._uniqueId];
    }

    //更新真实dom,保存新的节点

    update(fixedOldVnode, newVnode, oldComponentVnode._hostNode, instance.context);
    oldComponentVnode._hostNode = newVnode._hostNode;
    if (oldComponentVnode._instance.Vnode) {
        //更新React component的时候需要用新的完全更新旧的component，不然无法更新
        oldComponentVnode._instance.Vnode = newVnode;
    } else {
        oldComponentVnode._instance = newVnode;
    }

    if (oldComponentVnode._instance) {
        if (oldComponentVnode._instance.componentDidUpdate) {
            oldComponentVnode._instance.componentDidUpdate(oldProps, oldState, oldContext);
        }
        oldComponentVnode._instance.lifeCycle = _component.Com.UPDATED;
    }
}

function update(oldVnode, newVnode, parentDomNode, parentContext) {
    newVnode._hostNode = oldVnode._hostNode;
    if (oldVnode.type === newVnode.type) {
        if (oldVnode.type === "#text") {
            newVnode._hostNode = oldVnode._hostNode; //更新一个dom节点
            updateText(oldVnode, newVnode);

            return newVnode;
        }
        if (typeof oldVnode.type === 'string') {
            //原生html
            (0, _mapProps.updateProps)(oldVnode.props, newVnode.props, newVnode._hostNode);
            if (oldVnode.ref !== newVnode.ref) {
                // if (typeNumber(oldVnode.ref) === 5) {
                //     oldVnode.ref(null)
                // }
                (0, _Refs.setRef)(newVnode, oldVnode.owner, newVnode._hostNode);
            }

            //更新后的child，返回给组件
            newVnode.props.children = updateChild(oldVnode.props.children, newVnode.props.children, oldVnode._hostNode, parentContext);
        }
        if (typeof oldVnode.type === 'function') {
            //非原生
            if (!oldVnode._instance.render) {
                var props = newVnode.props;

                var newStateLessInstance = new newVnode.type(props, parentContext);
                update(oldVnode._instance, newStateLessInstance, parentDomNode, parentContext);
                newStateLessInstance.owner = oldVnode._instance.owner;
                newStateLessInstance.ref = oldVnode._instance.ref;
                newStateLessInstance.key = oldVnode._instance.key;
                newVnode._instance = newStateLessInstance;
                return newVnode;
            }

            updateComponent(oldVnode, newVnode, parentContext, parentDomNode);
            newVnode.owner = oldVnode.owner;
            newVnode.ref = oldVnode.ref;
            newVnode.key = oldVnode.key;
            newVnode._instance = oldVnode._instance;
            newVnode._PortalHostNode = oldVnode._PortalHostNode ? oldVnode._PortalHostNode : void 666;
        }
    } else {
        var dom = renderByLuy(newVnode, parentDomNode, true, parentContext);
        var parentNode = parentDomNode.parentNode;
        if (newVnode._hostNode) {
            parentNode.insertBefore(dom, oldVnode._hostNode);
            (0, _dispose.disposeVnode)(oldVnode);
        } else {
            parentNode.appendChild(dom);
            newVnode._hostNode = dom;
        }
    }
    return newVnode;
}

/**
 * 渲染自定义组件
 * @param {*} Vnode 
 * @param {Element} parentDomNode 
 */
function mountComponent(Vnode, parentDomNode, parentContext) {
    var type = Vnode.type,
        props = Vnode.props,
        key = Vnode.key,
        ref = Vnode.ref;


    var Component = type;
    var instance = new Component(props, parentContext);

    if (!instance.render) {
        Vnode._instance = instance; //for react-redux
        return renderByLuy(instance, parentDomNode, false, parentContext);
    }

    if (instance.getChildContext) {
        //如果用户定义getChildContext，那么用它生成子context
        instance.context = (0, _utils.extend)((0, _utils.extend)({}, instance.context), instance.getChildContext());
    } else {
        instance.context = (0, _utils.extend)({}, parentContext);
    }

    //生命周期函数
    instance.componentWillMount && instance.componentWillMount();

    var lastOwner = currentOwner.cur;
    currentOwner.cur = instance;
    var renderedVnode = instance.render();
    currentOwner.cur = lastOwner;

    if (renderedVnode === void 233) {
        console.warn('你可能忘记在组件render()方法中返回jsx了');
        return;
    }
    renderedVnode = renderedVnode ? renderedVnode : new _createElement.Vnode('#text', "", null, null);

    var domNode = renderByLuy(renderedVnode, parentDomNode, false, instance.context, instance);

    if (instance.componentDidMount) {
        instance.lifeCycle = _component.Com.MOUNTTING;
        instance.componentDidMount();
        instance.componentDidMount = null; //防止用户调用
        instance.lifeCycle = _component.Com.MOUNT;
    }

    renderedVnode.key = key || null;
    instance.Vnode = renderedVnode;
    instance.Vnode._hostNode = domNode; //用于在更新时期oldVnode的时候获取_hostNode
    instance.Vnode._mountIndex = mountIndexAdd();

    Vnode._instance = instance; // 在父节点上的child元素会保存一个自己
    Vnode._hostNode = domNode;

    (0, _Refs.setRef)(Vnode, instance, domNode);

    if (renderedVnode._PortalHostNode) {
        //支持react createPortal
        Vnode._PortalHostNode = renderedVnode._PortalHostNode;
        renderedVnode._PortalHostNode._PortalHostNode = domNode;
    }

    instance._updateInLifeCycle(); // componentDidMount之后一次性更新

    return domNode;
}

function mountNativeElement(Vnode, parentDomNode, instance) {
    var domNode = renderByLuy(Vnode, parentDomNode, false, instance);
    Vnode._hostNode = domNode;
    Vnode._mountIndex = mountIndexAdd();
    return domNode;
}
function mountTextComponent(Vnode, domNode) {
    var fixText = Vnode.props === 'createPortal' ? '' : Vnode.props;
    var textDomNode = document.createTextNode(fixText);
    domNode.appendChild(textDomNode);
    Vnode._hostNode = textDomNode;
    Vnode._mountIndex = mountIndexAdd();
    return textDomNode;
}

function mountChild(childrenVnode, parentDomNode, parentContext, instance) {

    var childType = (0, _utils.typeNumber)(childrenVnode);
    var flattenChildList = childrenVnode;

    if (childrenVnode === undefined) {
        flattenChildList = (0, _createElement.flattenChildren)(childrenVnode);
    }

    if (childType === 8 && childrenVnode !== undefined) {
        //Vnode
        if ((0, _utils.typeNumber)(childrenVnode.type) === 5) {
            flattenChildList._hostNode = renderByLuy(flattenChildList, parentDomNode, false, parentContext, instance);
        } else if ((0, _utils.typeNumber)(childrenVnode.type) === 3 || (0, _utils.typeNumber)(childrenVnode.type) === 4) {
            flattenChildList._hostNode = mountNativeElement(flattenChildList, parentDomNode, instance);
        }
    }
    if (childType === 7) {
        //list
        flattenChildList = (0, _createElement.flattenChildren)(childrenVnode);
        flattenChildList.forEach(function (item) {
            if (item) {
                if (typeof item.type === 'function') {
                    //如果是组件先不渲染子嗣
                    mountComponent(item, parentDomNode, parentContext);
                } else {
                    renderByLuy(item, parentDomNode, false, parentContext, instance);
                }
            }
        });
    }
    if (childType === 4 || childType === 3) {
        //string or number
        flattenChildList = (0, _createElement.flattenChildren)(childrenVnode);
        mountTextComponent(flattenChildList, parentDomNode);
    }
    return flattenChildList;
}

function findDOMNode(ref) {
    if (ref == null) {
        return null;
    }
    if (ref.nodeType === 1) {
        return ref;
    }
    return ref.__dom || null;
}

/**
 * ReactDOM.render()函数入口
 * 渲染组件，组件的子组件，都在这里
 * @param {*} Vnode 
 * @param {Element} container 
 * @param {boolean} isUpdate 
 * @param {boolean} instance 用于实现refs机制 
 */
var depth = 0;
function renderByLuy(Vnode, container, isUpdate, parentContext, instance) {
    var type = Vnode.type,
        props = Vnode.props;


    if (!type) return;
    var children = props.children;

    var domNode = void 0;
    if (typeof type === 'function') {
        var fixContext = parentContext || {};
        domNode = mountComponent(Vnode, container, fixContext);
    } else if (typeof type === 'string' && type === '#text') {
        domNode = mountTextComponent(Vnode, container);
    } else {
        domNode = document.createElement(type);
    }

    if (typeof type !== 'function') {
        if ((0, _utils.typeNumber)(children) > 2 && children !== undefined) {
            var NewChild = mountChild(children, domNode, parentContext, instance); //flatten之后的child 要保存下来
            props.children = NewChild;
        }
    }

    (0, _Refs.setRef)(Vnode, instance, domNode);
    (0, _mapProps.mapProp)(domNode, props, Vnode); //为元素添加props

    Vnode._hostNode = domNode; //缓存真实节点

    if (isUpdate) {
        return domNode;
    } else {
        Vnode._mountIndex = mountIndexAdd();
        if (container && domNode && container.nodeName !== '#text') {
            container.appendChild(domNode);
        }
    }
    return domNode;
}

function areTheyEqual(aDom, bDom) {
    if (aDom === bDom) return true;
    return false;
}

function render(Vnode, container) {
    if ((0, _utils.typeNumber)(container) !== 8) {
        throw new Error('Target container is not a DOM element.');
    }

    var UniqueKey = container.UniqueKey;
    if (container.UniqueKey) {
        //已经被渲染
        var oldVnode = containerMap[UniqueKey];
        var rootVnode = update(oldVnode, Vnode, container);
        return Vnode._instance;
    } else {
        //第一次渲染的时候
        container.UniqueKey = Date.now();
        containerMap[container.UniqueKey] = Vnode;
        renderByLuy(Vnode, container);
        return Vnode._instance;
    }
}