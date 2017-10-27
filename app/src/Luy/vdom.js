//@flow
import { typeNumber, isSameVnode, mapKeyToIndex, isEventName, extend } from "./utils";
import { flattenChildren, Vnode as VnodeClass } from './createElement'
import { mapProp, mappingStrategy, updateProps } from './mapProps'
import { setRef } from './Refs'
import { Com } from './component'



//Top Api
export function createPortal(children, container) {
    if (container) {
        if (Array.isArray(children)) {
            mountChild(children, container)
        } else {
            renderByLuy(children, container)
        }
    }
    //用于记录Portal的事物
    const CreatePortalVnode = new VnodeClass('#text', "createPortal", null, null)
    CreatePortalVnode._PortalHostNode = container
    return CreatePortalVnode
}


let mountIndex = 0 //全局变量
var containerMap = {}
export var currentOwner = {
    cur: null
};


function instanceProps(componentVnode) {
    return {
        oldState: componentVnode._instance.state,
        oldProps: componentVnode._instance.props,
        oldContext: componentVnode._instance.context,
        oldVnode: componentVnode._instance.Vnode
    }
}

function mountIndexAdd() {
    return mountIndex++
}

function updateText(oldTextVnode, newTextVnode, parentDomNode: Element) {
    let dom: Element = oldTextVnode._hostNode

    if (oldTextVnode.props !== newTextVnode.props) {

        dom.nodeValue = newTextVnode.props
    }
}

function updateChild(oldChild, newChild, parentDomNode: Element, parentContext) {
    newChild = flattenChildren(newChild)
    oldChild = flattenChildren(oldChild)
    if (!Array.isArray(oldChild)) oldChild = [oldChild]
    if (!Array.isArray(newChild)) newChild = [newChild]

    let oldLength = oldChild.length,
        newLength = newChild.length,
        oldStartIndex = 0, newStartIndex = 0,
        oldEndIndex = oldLength - 1,
        newEndIndex = newLength - 1,
        oldStartVnode = oldChild[0],
        newStartVnode = newChild[0],
        oldEndVnode = oldChild[oldEndIndex],
        newEndVnode = newChild[newEndIndex],
        hascode = {};

    if (newLength && !oldLength) {
        newChild.forEach((newVnode) => {
            renderByLuy(newVnode, parentDomNode, false, parentContext)
        })
        return newChild
    }

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (oldStartVnode === undefined) {
            oldStartVnode = oldChild[++oldStartIndex]
        }
        else if (oldEndVnode === undefined) {
            oldEndVnode = oldChild[--oldEndIndex]
        }
        else if (isSameVnode(oldStartVnode, newStartVnode)) {
            update(oldStartVnode, newStartVnode, newStartVnode._hostNode, parentContext)
            oldStartVnode = oldChild[++oldStartIndex]
            newStartVnode = newChild[++newStartIndex]
        }
        else if (isSameVnode(oldEndVnode, newEndVnode)) {
            update(oldEndVnode, newEndVnode, newEndVnode._hostNode, parentContext)
            oldEndVnode = oldChild[--oldEndIndex]
            newEndVnode = newChild[--newEndIndex]
        }
        else if (isSameVnode(oldStartVnode, newEndVnode)) {
            let dom = oldStartVnode._hostNode
            parentDomNode.insertBefore(dom, oldEndVnode.nextSibling)
            update(oldStartVnode, newEndVnode, oldStartVnode._hostNode._hostNode, parentContext)
            oldStartVnode = oldChild[++oldStartIndex]
            newEndVnode = newChild[--newEndIndex]
        } else if (isSameVnode(oldEndVnode, newStartVnode)) {
            let dom = oldEndVnode._hostNode
            parentDomNode.insertBefore(dom, oldStartVnode._hostNode)
            update(oldStartVnode, newEndVnode, oldStartVnode._hostNode, parentContext)
            oldEndVnode = oldChild[--oldEndIndex]
            newStartVnode = newChild[++newStartIndex]
        }
        else {
            if (hascode === undefined) hascode = mapKeyToIndex(oldChild)

            let indexInOld = hascode[newStartVnode.key]

            if (indexInOld === undefined) {
                let newElm = renderByLuy(newStartVnode, parentDomNode, true, parentContext)
                parentDomNode.insertBefore(newElm, oldStartVnode._hostNode)
                newStartVnode = newChild[++newStartIndex]
            } else {
                let moveVnode = oldChild[indexInOld]
                update(moveVnode, newStartVnode, moveVnode._hostNode, parentContext)
                parentDomNode.insertBefore(moveVnode._hostNode, oldStartVnode._hostNode)
                oldChild[indexInOld] = undefined
                newStartVnode = newChild[++newStartIndex]
            }
        }
        if (oldStartIndex > oldEndIndex) {

            for (; newStartIndex - 1 < newEndIndex; newStartIndex++) {
                if (newChild[newStartIndex]) {
                    let newDomNode = renderByLuy(newChild[newStartIndex], parentDomNode, true, parentContext)
                    if (oldChild[oldChild.length - 1]) {
                        parentDomNode.insertBefore(newDomNode, oldChild[oldChild.length - 1]._hostNode)
                    } else {

                        parentDomNode.appendChild(newDomNode)
                    }
                    newChild[newStartIndex]._hostNode = newDomNode
                }
            }

        } else if (newStartIndex > newEndIndex) {

            for (; oldStartIndex - 1 < oldEndIndex; oldStartIndex++) {
                if (oldChild[oldStartIndex]) {
                    let removeNode = oldChild[oldStartIndex]
                    disposeVnode(removeNode)
                }
            }
        }
    }
    return newChild
}

function disposeVnode(Vnode) {//主要用于删除Vnode对应的节点
    if (typeof Vnode.type === 'function') {
        if (Vnode._instance.componentWillUnMount) {
            Vnode._instance.componentWillUnMount()
        }
    }
    if (Vnode.props.children) {
        disposeChildVnode(Vnode.props.children)
    }
    if (Vnode._PortalHostNode) {
        const parent = Vnode._PortalHostNode.parentNode
        parent.removeChild(Vnode._PortalHostNode)
    } else {
        if (Vnode._hostNode) {//有可能会出现undefind的情况
            const parent = Vnode._hostNode.parentNode
            parent.removeChild(Vnode._hostNode)
        }
    }
    Vnode._hostNode = null
}

function disposeChildVnode(childVnode) {
    let children = childVnode
    if (typeNumber(children) !== 7) children = [children]
    children.forEach((child) => {
        if (typeof child.type === 'function') {
            if (child._instance.componentWillUnMount) {
                child._instance.componentWillUnMount()
            }
        }
        child._hostNode = null
        child._instance = null
        if (child.props.children) {
            disposeChildVnode(child.props.children)
        }
    })
}

function updateComponent(oldComponentVnode, newComponentVnode, parentContext) {
    const {
        oldState,
        oldProps,
        oldContext,
        oldVnode
    } = instanceProps(oldComponentVnode)

    const newProps = newComponentVnode.props
    let newContext = parentContext
    const newInstance = new newComponentVnode.type(newProps, newContext)

    if (newInstance.getChildContext) {
        newContext = extend(extend({}, newContext), newInstance.getChildContext())
    }
    oldComponentVnode._instance.lifeCycle = Com.UPDATING
    if (oldComponentVnode._instance.componentWillReceiveProps) {
        oldComponentVnode._instance.componentWillReceiveProps(newProps, newContext)
    }

    if (oldComponentVnode._instance.shouldComponentUpdate) {
        let shouldUpdate = oldComponentVnode._instance.shouldComponentUpdate(newProps, oldState, newContext)
        if (!shouldUpdate) {
            //无论shouldComponentUpdate结果是如何，数据都会给用户设置上去
            //但是不一定会刷新
            newInstance.state = oldState
            newInstance.context = newContext

            oldComponentVnode._instance.props = newProps
            oldComponentVnode._instance.context = newContext
            newComponentVnode._instance = oldComponentVnode._instance
            return
        }
    }

    if (oldComponentVnode._instance.componentWillUpdate) {
        oldComponentVnode._instance.componentWillUpdate(newProps, oldState, newContext)
    }

    newInstance.state = oldState
    newInstance.context = extend(extend({}, oldContext), newContext)
    // console.log(oldContext)

    let newVnode = newInstance.render()

    newVnode = newVnode ? newVnode : new VnodeClass('#text', "", null, null)
    //更新原来组件的信息
    oldComponentVnode._instance.props = newProps
    oldComponentVnode._instance.context = newContext

    //更新父组件的信息
    newComponentVnode._instance = oldComponentVnode._instance

    //更新真实dom
    update(oldVnode, newVnode, oldComponentVnode._hostNode, newInstance.context)

    if (oldComponentVnode._instance) {
        if (oldComponentVnode._instance.componentDidUpdate) {
            oldComponentVnode._instance.componentDidUpdate(oldProps, oldState, oldContext)
        }
        oldComponentVnode._instance.lifeCycle = Com.UPDATED
    }

}


export function update(oldVnode, newVnode, parentDomNode: Element, parentContext) {
    newVnode._hostNode = oldVnode._hostNode
    if (oldVnode.type === newVnode.type) {
        if (oldVnode.type === "#text") {
            newVnode._hostNode = oldVnode._hostNode //更新一个dom节点
            updateText(oldVnode, newVnode)

            return newVnode
        }
        if (typeof oldVnode.type === 'string') {//原生html
            updateProps(oldVnode.props, newVnode.props, newVnode._hostNode)

            if (oldVnode.ref !== newVnode.ref) {
                if (typeNumber(oldVnode.ref) === 5) {
                    oldVnode.ref(null)
                }
                setRef(newVnode, oldVnode.owner, newVnode._hostNode)
            }

            //更新后的child，返回给组件
            newVnode.props.children = updateChild(
                oldVnode.props.children,
                newVnode.props.children,
                oldVnode._hostNode,
                parentContext)
        }
        if (typeof oldVnode.type === 'function') {//非原生
            let newInstance = new newVnode.type(newVnode.props, parentContext)
            const oldInstance = new oldVnode.type(oldVnode.props,parentContext)
            if (newInstance.render) {
                updateComponent(oldVnode, newVnode, parentContext)
            } else {
                oldInstance.owner = oldVnode.owner
                oldInstance.ref = oldVnode.ref
                oldInstance.key = oldVnode.key
                oldInstance._hostNode = oldVnode._hostNode
                update(oldInstance, newInstance,parentDomNode, parentContext)
            }
        }
    } else {
        let dom = renderByLuy(newVnode, parentDomNode, true)
        const parentNode = oldVnode._hostNode.parentNode
        if (newVnode._hostNode) {
            parentNode.insertBefore(dom, oldVnode._hostNode)
            parentNode.removeChild(oldVnode._hostNode)
        } else {
            parentNode.appendChild(dom)
        }
    }
    return newVnode
}

function renderHoc(instance, props, parentContext) {
    if (typeNumber(instance) === 5) {
        const newInstance = new instance(props, parentContext)
        return renderHoc(newInstance)
    } else {
        if (!instance.render) {
            return instance
        } else {
            return instance.render()
        }
    }
}

/**
 * 渲染自定义组件
 * @param {*} Vnode 
 * @param {Element} parentDomNode 
 */
function mountComponent(Vnode, parentDomNode: Element, parentContext) {
    const { type, props, key, ref } = Vnode

    const Component = type
    let instance = new Component(props, parentContext)

    if (!instance.render) {
       
        return renderByLuy(instance, parentDomNode, false, parentContext)
    }

    if (instance.getChildContext) {//如果用户定义getChildContext，那么用它生成子context
        instance.context = extend(extend({}, instance.context), instance.getChildContext());
    } else {
        instance.context = extend({}, parentContext)
    }

    if (instance.componentWillMount) {//生命周期函数
        instance.componentWillMount()
    }
    let lastOwner = currentOwner.cur
    currentOwner.cur = instance
    let renderedVnode = instance.render()
    currentOwner.cur = lastOwner

    if (renderedVnode === void 233) {
        console.warn('你可能忘记在组件render()方法中返回jsx了')
        return
    }
    renderedVnode = renderedVnode ? renderedVnode : new VnodeClass('#text', "", null, null);

    const domNode = renderByLuy(renderedVnode, parentDomNode, false, instance.context, instance);

    if (instance.componentDidMount) {
        instance.lifeCycle = Com.MOUNTTING
        instance.componentDidMount()
        instance.componentDidMount = null//暂时不知道为什么要设置为空
        instance.lifeCycle = Com.MOUNT
    }

    renderedVnode.key = key || null
    instance.Vnode = renderedVnode
    instance.Vnode._hostNode = domNode//用于在更新时期oldVnode的时候获取_hostNode
    instance.Vnode._mountIndex = mountIndexAdd()

    Vnode._instance = instance // 在父节点上的child元素会保存一个自己
    Vnode._hostNode = domNode

    setRef(Vnode, instance, domNode)

    if (renderedVnode._PortalHostNode) {//支持react createPortal
        Vnode._PortalHostNode = renderedVnode._PortalHostNode
    }

    instance._updateInLifeCycle() // componentDidMount之后一次性更新

    return domNode
}

function mountNativeElement(Vnode, parentDomNode: Element, instance) {

    const domNode = renderByLuy(Vnode, parentDomNode, false, instance)
    Vnode._hostNode = domNode
    Vnode._mountIndex = mountIndexAdd()
    return domNode
}
function mountTextComponent(Vnode, domNode: Element) {
    let fixText = Vnode.props === 'createPortal' ? '' : Vnode.props
    let textDomNode = document.createTextNode(fixText)
    domNode.appendChild(textDomNode)
    Vnode._hostNode = textDomNode
    Vnode._mountIndex = mountIndexAdd()
    return textDomNode
}

function mountChild(childrenVnode, parentDomNode: Element, parentContext, instance) {

    let childType = typeNumber(childrenVnode)
    let flattenChildList = childrenVnode;

    if (childrenVnode === undefined) {
        flattenChildList = flattenChildren(childrenVnode)
    }

    if (childType === 8 && childrenVnode !== undefined) { //Vnode
        if (typeNumber(childrenVnode.type) === 5) {
            flattenChildList._hostNode = renderByLuy(flattenChildList, parentDomNode, false, parentContext, instance)
        } else if (typeNumber(childrenVnode.type) === 3 || typeNumber(childrenVnode.type) === 4) {
            flattenChildList._hostNode = mountNativeElement(flattenChildList, parentDomNode, instance)
        }
    }
    if (childType === 7) {//list
        flattenChildList = flattenChildren(childrenVnode)
        flattenChildList.forEach((item) => {
            if (item) {
                if (typeof item.type === 'function') { //如果是组件先不渲染子嗣
                    mountComponent(item, parentDomNode, parentContext)
                } else {
                    renderByLuy(item, parentDomNode, false, parentContext, instance)
                }
            }
        })
    }
    if (childType === 4 || childType === 3) {//string or number
        flattenChildList = flattenChildren(childrenVnode)
        mountTextComponent(flattenChildList, parentDomNode)
    }
    return flattenChildList
}


export function findDOMNode(ref) {
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
let depth = 0
function renderByLuy(Vnode, container: Element, isUpdate: boolean, parentContext, instance) {

    const { type, props } = Vnode
    const { children } = props
    let domNode
    if (typeof type === 'function') {
        const fixContext = parentContext || {}
        domNode = mountComponent(Vnode, container, fixContext)
    } else if (typeof type === 'string' && type === '#text') {
        domNode = mountTextComponent(Vnode, container)
    } else {
        domNode = document.createElement(type)
    }

    if (typeof type !== 'function') {
        if (typeNumber(children) > 2 && children !== undefined) {
            const NewChild = mountChild(children, domNode, parentContext, instance)//flatten之后的child 要保存下来
            props.children = NewChild
        }
    }

    setRef(Vnode, instance, domNode)
    mapProp(domNode, props, Vnode) //为元素添加props

    Vnode._hostNode = domNode //缓存真实节点

    if (isUpdate) {
        return domNode
    } else {
        Vnode._mountIndex = mountIndexAdd()
        if (container && domNode && container.nodeName !== '#text') {
            container.appendChild(domNode)
        }
    }
    return domNode
}

function areTheyEqual(aDom, bDom) {
    if (aDom === bDom) return true
    return false
}

export function render(Vnode, container) {
    if (typeNumber(container) !== 8) {
        throw new Error('Target container is not a DOM element.')
    }

    const UniqueKey = container.UniqueKey

    if (container.UniqueKey) {//已经被渲染

        const oldVnode = containerMap[UniqueKey]
        const rootVnode = update(oldVnode, Vnode, container)
        return rootVnode._hostNode
    } else {
        //没有被渲染
        container.UniqueKey = Date.now()
        containerMap[container.UniqueKey] = Vnode
        renderByLuy(Vnode, container)
        return Vnode._instance
    }
}