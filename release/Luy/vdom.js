'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.update = update;
exports.findDOMNode = findDOMNode;
exports.render = render;

var _utils = require('./utils');

var _createElement = require('./createElement');

var _mapProps = require('./mapProps');

var _component = require('./component');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mountIndex = 0; //全局变量
var Owner = []; //用于记录component实例

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

    if (newLength && !oldLength) {
        newChild.forEach(function (newVnode) {
            renderByLuy(newVnode, parentDomNode, false, parentContext);
        });

        return newChild;
    }

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (oldStartVnode === undefined) {
            oldStartVnode = oldChild[++oldStartIndex];
        } else if (oldEndVnode === undefined) {
            oldEndVnode = oldChild[--oldEndIndex];
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
            console.log('更新');
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
                    if (oldChild[oldChild.length - 1]) {
                        parentDomNode.insertBefore(newDomNode, oldChild[oldChild.length - 1]._hostNode);
                    } else {
                        parentDomNode.appendChild(newDomNode);
                    }
                    newChild[newStartIndex]._hostNode = newDomNode;
                }
            }
        } else if (newStartIndex > newEndIndex) {

            for (; oldStartIndex - 1 < oldEndIndex; oldStartIndex++) {
                if (oldChild[oldStartIndex]) {
                    var removeNode = oldChild[oldStartIndex];
                    if (typeof oldChild[oldStartIndex].type === 'function') {
                        if (removeNode._instance.componentWillUnMount) {
                            removeNode._instance.componentWillUnMount();
                        }
                    }

                    parentDomNode.removeChild(oldChild[oldStartIndex]._hostNode);
                }
            }
        }
    }

    return newChild;
}

function updateComponent(oldComponentVnode, newComponentVnode, parentContext) {

    var oldState = oldComponentVnode._instance.state;
    var oldProps = oldComponentVnode._instance.props;
    var oldContext = oldComponentVnode._instance.context;
    var oldVnode = oldComponentVnode._instance.Vnode;

    var newProps = newComponentVnode.props;
    var newContext = parentContext;
    var newInstance = new newComponentVnode.type(newProps);

    if (oldComponentVnode._instance.componentWillReceiveProps) {
        oldComponentVnode._instance.componentWillReceiveProps(newProps, newContext);
    }

    if (oldComponentVnode._instance.shouldComponentUpdate) {
        var shouldUpdate = oldComponentVnode._instance.shouldComponentUpdate(newProps, oldState, newContext);
        if (!shouldUpdate) {
            //无论shouldComponentUpdate结果是如何，数据都会给用户设置上去
            //但是不一定会刷新
            newInstance.state = oldState;
            newInstance.context = newContext;

            oldComponentVnode._instance.props = newProps;
            oldComponentVnode._instance.context = newContext;
            newComponentVnode._instance = oldComponentVnode._instance;
            return;
        }
    }

    if (oldComponentVnode._instance.componentWillUpdate) {
        oldComponentVnode._instance.componentWillUpdate(newProps, oldState, newContext);
    }

    newInstance.state = oldState;
    newInstance.context = newContext;
    var newVnode = newInstance.render();

    //更新原来组件的信息
    oldComponentVnode._instance.props = newProps;
    oldComponentVnode._instance.context = newContext;
    console.log(newComponentVnode);
    //更新父组件的信息
    newComponentVnode._instance = oldComponentVnode._instance;

    //更新真实dom
    update(oldVnode, newVnode, oldComponentVnode._hostNode);

    if (oldComponentVnode._instance.componentDidUpdate) {

        oldComponentVnode._instance.componentDidUpdate(oldProps, oldState, oldContext);
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
            //更新后的child，返回给组件
            newVnode.props.children = updateChild(oldVnode.props.children, newVnode.props.children, oldVnode._hostNode, parentContext);

            var nextStyle = newVnode.props.style;
            //更新css
            if (oldVnode.props.style !== nextStyle) {
                (0, _keys2.default)(nextStyle).forEach(function (s) {
                    return newVnode._hostNode.style[s] = nextStyle[s];
                });
            }
            if (newVnode.props.dangerouslySetInnerHTML) {
                _mapProps.mappingStrategy['dangerouslySetInnerHTML'](newVnode._hostNode, newVnode.props['dangerouslySetInnerHTML']);
            }
        }
        if (typeof oldVnode.type === 'function') {
            //非原生
            updateComponent(oldVnode, newVnode, parentContext);
        }
    } else {
        var dom = renderByLuy(newVnode, parentDomNode, true);

        if (newVnode._hostNode) {
            parentDomNode.insertBefore(dom, newVnode._hostNode);
            if (typeof newVnode.type === 'function') {
                console.log('等待实现');
            }

            parentDomNode.removeChild(newVnode._hostNode);
        } else {
            parentDomNode.appendChild(dom);
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
        props = Vnode.props;


    var Component = type;
    var instance = new Component(props);

    if (instance.getChildContext) {

        instance.context = (0, _utils.extend)((0, _utils.extend)({}, instance.context), instance.getChildContext());
    } else {
        instance.context = parentContext;
    }

    if (instance.componentWillMount) {
        //生命周期函数
        instance.componentWillMount();
    }
    var renderedVnode = instance.render();
    if (!renderedVnode) console.warn('你可能忘记在组件render()方法中返回jsx了');

    var domNode = renderByLuy(renderedVnode, parentDomNode, false, instance.context, instance);

    if (instance.componentDidMount) {
        instance.lifeCycle = _component.Com.MOUNTTING;
        instance.componentDidMount();
        instance.componentDidMount = null; //暂时不知道为什么要设置为空
        instance.lifeCycle = _component.Com.MOUNT;
    }

    instance.Vnode = renderedVnode;
    instance.Vnode._hostNode = domNode; //用于在更新时期oldVnode的时候获取_hostNode
    instance.Vnode._mountIndex = mountIndexAdd();

    Vnode._instance = instance; // 在父节点上的child元素会保存一个自己

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
    var textDomNode = document.createTextNode(Vnode.props);
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
        flattenChildList._hostNode = mountNativeElement(flattenChildList, parentDomNode, instance);
    }
    if (childType === 7) {
        //list
        flattenChildList = (0, _createElement.flattenChildren)(childrenVnode);

        flattenChildList.forEach(function (item) {

            renderByLuy(item, parentDomNode, false, parentContext, instance);
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
 */
var depth = 0;
function renderByLuy(Vnode, container, isUpdate, parentContext, instance) {
    var type = Vnode.type,
        props = Vnode.props;
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

    /**
     * 特殊处理，当children=0数字的时候也能渲染了
     */
    if ((0, _utils.typeNumber)(children) > 2 && children !== undefined) {
        var NewChild = mountChild(children, domNode, parentContext, instance); //flatten之后的child 要保存下来
        props.children = NewChild;
    }

    if (instance) {
        if ((0, _utils.typeNumber)(Vnode.ref) === 3 || (0, _utils.typeNumber)(Vnode.ref) === 4) {
            instance.refs[Vnode.ref] = domNode;
        }
        if ((0, _utils.typeNumber)(Vnode.ref) === 5) {
            Vnode.ref(domNode);
        }
    }

    (0, _mapProps.mapProp)(domNode, props); //为元素添加props

    Vnode._hostNode = domNode; //缓存真实节点

    if (isUpdate) {
        return domNode;
    } else {
        Vnode._mountIndex = mountIndexAdd();
        if (container) container.appendChild(domNode);
    }
    return domNode;
}

function render(Vnode, container) {
    var rootDom = renderByLuy(Vnode, container);

    return rootDom;
}
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(mountIndex, 'mountIndex', 'app/src/Luy/vdom.js');

    __REACT_HOT_LOADER__.register(Owner, 'Owner', 'app/src/Luy/vdom.js');

    __REACT_HOT_LOADER__.register(mountIndexAdd, 'mountIndexAdd', 'app/src/Luy/vdom.js');

    __REACT_HOT_LOADER__.register(updateText, 'updateText', 'app/src/Luy/vdom.js');

    __REACT_HOT_LOADER__.register(updateChild, 'updateChild', 'app/src/Luy/vdom.js');

    __REACT_HOT_LOADER__.register(updateComponent, 'updateComponent', 'app/src/Luy/vdom.js');

    __REACT_HOT_LOADER__.register(update, 'update', 'app/src/Luy/vdom.js');

    __REACT_HOT_LOADER__.register(mountComponent, 'mountComponent', 'app/src/Luy/vdom.js');

    __REACT_HOT_LOADER__.register(mountNativeElement, 'mountNativeElement', 'app/src/Luy/vdom.js');

    __REACT_HOT_LOADER__.register(mountTextComponent, 'mountTextComponent', 'app/src/Luy/vdom.js');

    __REACT_HOT_LOADER__.register(mountChild, 'mountChild', 'app/src/Luy/vdom.js');

    __REACT_HOT_LOADER__.register(findDOMNode, 'findDOMNode', 'app/src/Luy/vdom.js');

    __REACT_HOT_LOADER__.register(depth, 'depth', 'app/src/Luy/vdom.js');

    __REACT_HOT_LOADER__.register(renderByLuy, 'renderByLuy', 'app/src/Luy/vdom.js');

    __REACT_HOT_LOADER__.register(render, 'render', 'app/src/Luy/vdom.js');
}();

;