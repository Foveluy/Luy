//@flow
import { typeNumber, isSameVnode, mapKeyToIndex, isEventName } from "./utils";
import { flattenChildren } from './createElement'
import { mapProp } from './mapProps'
import { Com } from './component'


let mountIndex = 0 //全局变量
function mountIndexAdd() {
    return mountIndex++
}

function updateText(oldTextVnode, newTextVnode, parentDomNode: Element) {
    let dom: Element = oldTextVnode._hostNode

    if (oldTextVnode.props !== newTextVnode.props) {

        dom.nodeValue = newTextVnode.props
    }
}

function updateChild(oldChild, newChild, parentDomNode: Element) {
    newChild = flattenChildren(newChild)

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
            renderByLuy(newVnode, parentDomNode)
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
            update(oldStartVnode, newStartVnode, newStartVnode._hostNode)
            oldStartVnode = oldChild[++oldStartIndex]
            newStartVnode = newChild[++newStartIndex]
        }
        else if (isSameVnode(oldEndVnode, newEndVnode)) {
            update(oldEndVnode, newEndVnode, newEndVnode._hostNode)
            oldEndVnode = oldChild[--oldEndIndex]
            newEndVnode = newChild[--newEndIndex]
        }
        else if (isSameVnode(oldStartVnode, newEndVnode)) {
            let dom = oldStartVnode._hostNode
            parentDomNode.insertBefore(dom, oldEndVnode.nextSibling)
            update(oldStartVnode, newEndVnode, oldStartVnode._hostNode._hostNode)
            oldStartVnode = oldChild[++oldStartIndex]
            newEndVnode = newChild[--newEndIndex]
        } else if (isSameVnode(oldEndVnode, newStartVnode)) {
            let dom = oldEndVnode._hostNode
            parentDomNode.insertBefore(dom, oldStartVnode._hostNode)
            update(oldStartVnode, newEndVnode, oldStartVnode._hostNode)
            oldEndVnode = oldChild[--oldEndIndex]
            newStartVnode = newChild[++newStartIndex]
        }
        else {
            if (hascode === undefined) hascode = mapKeyToIndex(oldChild)

            let indexInOld = hascode[newStartVnode.key]

            if (indexInOld === undefined) {
                let newElm = renderByLuy(newStartVnode, parentDomNode, true)
                parentDomNode.insertBefore(newElm, oldStartVnode._hostNode)
                newStartVnode = newChild[++newStartIndex]
            } else {
                let moveVnode = oldChild[indexInOld]
                update(moveVnode, newStartVnode, moveVnode._hostNode)
                parentDomNode.insertBefore(moveVnode._hostNode, oldStartVnode._hostNode)
                oldChild[indexInOld] = undefined
                newStartVnode = newChild[++newStartIndex]
            }
        }
        if (oldStartIndex > oldEndIndex) {

            for (; newStartIndex - 1 < newEndIndex; newStartIndex++) {

                if (newChild[newStartIndex]) {
                    renderByLuy(newChild[newStartIndex], parentDomNode)
                }
            }

        } else if (newStartIndex > newEndIndex) {

            for (; oldStartIndex - 1 < oldEndIndex; oldStartIndex++) {
                if (oldChild[oldStartIndex]) {
                    parentDomNode.removeChild(oldChild[oldStartIndex]._hostNode)
                }
            }
        }
    }

    return newChild
}

function updateComponent(oldComponentVnode, newComponentVnode) {
    console.log(oldComponentVnode)
    const oldState = oldComponentVnode._instance.state
    const oldProps = oldComponentVnode._instance.props
    const oldContext = oldComponentVnode._instance.context
    const oldVnode = oldComponentVnode._instance.Vnode

    const newProps = newComponentVnode.props
    const newContext = newComponentVnode.context
    const newInstance = new newComponentVnode.type(newProps)

    if (oldComponentVnode._instance.componentWillReceiveProps) {
        oldComponentVnode._instance.componentWillReceiveProps(newProps, newContext)
    }

    newInstance.state = oldState
    newInstance.context = newContext
    const newVnode = newInstance.render()


    //更新原来组件的信息
    oldComponentVnode._instance.props = newProps
    oldComponentVnode._instance.context = newContext

    //更新父组件的信息
    newComponentVnode._instance = oldComponentVnode._instance

    //更新真实dom
    update(oldVnode, newVnode, oldComponentVnode._hostNode)
}


export function update(oldVnode, newVnode, parentDomNode: Element) {
    newVnode._hostNode = oldVnode._hostNode

    if (oldVnode.type === newVnode.type) {
        if (oldVnode.type === "#text") {
            newVnode._hostNode = oldVnode._hostNode //更新一个dom节点
            updateText(oldVnode, newVnode)

            return newVnode
        }
        if (typeof oldVnode.type === 'string') {//原生html
            //更新后的child，返回给组件
            newVnode.props.children = updateChild(oldVnode.props.children, newVnode.props.children, oldVnode._hostNode)
            const nextStyle = newVnode.props.style;
            //更新css
            if (oldVnode.props.style !== nextStyle) {
                Object.keys(nextStyle).forEach((s) => newVnode._hostNode.style[s] = nextStyle[s])
            }
        }
        if (typeof oldVnode.type === 'function') {//非原生
            updateComponent(oldVnode, newVnode)
        }
    } else {
        let dom = renderByLuy(newVnode, parentDomNode, true)
        if (newVnode._hostNode) {
            parentDomNode.insertBefore(dom, newVnode._hostNode)
            parentDomNode.removeChild(newVnode._hostNode)
        } else {
            parentDomNode.appendChild(dom)
        }
    }
    return newVnode
}
/**
 * 渲染自定义组件
 * @param {*} Vnode 
 * @param {Element} parentDomNode 
 */
function mountComponent(Vnode, parentDomNode: Element) {
    const { type, props } = Vnode

    const Component = type
    const instance = new Component(props)

    if (instance.componentWillMount) {//生命周期函数
        instance.componentWillMount()
    }

    const renderedVnode = instance.render()
    if (!renderedVnode) console.warn('你可能忘记在组件render()方法中返回jsx了')


    const domNode = renderByLuy(renderedVnode, parentDomNode)

    if (instance.componentDidMount) {
        instance.lifeCycle = Com.MOUNTTING
        instance.componentDidMount()
        instance.componentDidMount = null//暂时不知道为什么要设置为空
        instance.lifeCycle = Com.MOUNT
    }

    instance.Vnode = renderedVnode
    instance.Vnode._hostNode = domNode//用于在更新时期oldVnode的时候获取_hostNode
    instance.Vnode._mountIndex = mountIndexAdd()

    Vnode._instance = instance // 在父节点上的child元素会保存一个自己


    return domNode
}

function mountNativeElement(Vnode, parentDomNode: Element) {
    const domNode = renderByLuy(Vnode, parentDomNode)
    Vnode._hostNode = domNode
    Vnode._mountIndex = mountIndexAdd()
    return domNode
}
function mountTextComponent(Vnode, domNode: Element) {
    let textDomNode = document.createTextNode(Vnode.props)
    domNode.appendChild(textDomNode)
    Vnode._hostNode = textDomNode
    Vnode._mountIndex = mountIndexAdd()
    return textDomNode
}

function mountChild(childrenVnode, parentDomNode: Element) {

    let childType = typeNumber(childrenVnode)
    let flattenChildList = childrenVnode;
    if (childType === 8) { //Vnode
        flattenChildList._hostNode = mountNativeElement(flattenChildList, parentDomNode)
    }
    if (childType === 7) {//list
        flattenChildList = flattenChildren(childrenVnode)
        flattenChildList.forEach((item) => {
            renderByLuy(item, parentDomNode)
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
 */
let depth = 0
function renderByLuy(Vnode, container: Element, isUpdate: boolean) {
    console.log(Vnode)
    const { type, props } = Vnode
    
    const { children } = props
    let domNode
    if (typeof type === 'function') {
        domNode = mountComponent(Vnode, container)
    } else if (typeof type === 'string' && type === '#text') {
        domNode = mountTextComponent(Vnode, container)
    } else {
        domNode = document.createElement(type)
    }

    if (children) {
        props.children = mountChild(children, domNode)//flatten之后的child 要保存下来
    }

    mapProp(domNode, props) //为元素添加props

    Vnode._hostNode = domNode //缓存真实节点

    if (isUpdate) {
        return domNode
    } else {
        Vnode._mountIndex = mountIndexAdd()
        if (container)
            container.appendChild(domNode)
    }
    return domNode
}

export function render(Vnode, container) {
    const rootDom = renderByLuy(Vnode, container)
    return rootDom
}