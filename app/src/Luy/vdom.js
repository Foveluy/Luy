//@flow
import { typeNumber } from "./utils";
import { flattenChildren } from './createElement'

let mountIndex = 0 //全局变量


function updateText(oldTextVnode, newTextVnode, parentDomNode: Element) {
    let dom: Element = oldTextVnode._hostNode
    if (oldTextVnode.props !== newTextVnode.props) {
        dom.nodeValue = newTextVnode.props
    }
}

function updateChild(oldChild, newChild, parentDomNode: Element) {
    newChild = flattenChildren(newChild)
    //如果不是array就转化成array
    if (!Array.isArray(oldChild)) {
        oldChild = [oldChild]
    }
    if (!Array.isArray(newChild)) {
        newChild = [newChild]
    }

    let TwoMaxlength = Math.max(oldChild.length, newChild.length)
    if (oldChild.length > newChild.length || oldChild.length < newChild.length) {
        while (parentDomNode.firstChild) {
            parentDomNode.removeChild(parentDomNode.firstChild)
        }
    }

    for (let i = 0; i < TwoMaxlength; i++) {
        const oldChildVnode = oldChild[i]
        const newChildVnode = newChild[i]

        if (oldChild.length > newChild.length && newChildVnode) {
            renderByLuy(newChildVnode, parentDomNode)
            continue
        }
        if (oldChild.length < newChild.length) {
            renderByLuy(newChildVnode, parentDomNode)
            continue
        }

        if (newChildVnode && oldChildVnode && oldChildVnode._hostNode) {
            newChildVnode._hostNode = oldChildVnode._hostNode
        }
        if (newChildVnode && oldChildVnode && oldChildVnode.type === newChildVnode.type) {
            if (oldChildVnode.type === '#text') {
                updateText(oldChildVnode, newChildVnode, parentDomNode)
            } else {
                update(oldChildVnode, newChildVnode, oldChildVnode._hostNode)
            }
            if (oldChild.length > newChild.length) console.log(newChildVnode)
        } else {
            //如果类型都不一样了，直接替换
            //当节点变多和变少的时候，可能会造成节点数量不相同的情况
            //此时就会出现length不相等
            if (newChildVnode) {
                renderByLuy(newChildVnode, parentDomNode, true)
            }
        }
    }
    if (oldChild.length < newChild.length) {
        console.log(oldChild, newChild)
    }
    return newChild
}

export function update(oldVnode, newVnode, parentDomNode: Element) {
    newVnode._hostNode = oldVnode._hostNode
    if (oldVnode.type === newVnode.type) {
        if (typeof oldVnode.type === 'string') {//原生html
            //更新后的child，返回给组件
            newVnode.props.children = updateChild(oldVnode.props.children, newVnode.props.children, newVnode._hostNode)
            const nextStyle = newVnode.props.style;
            //更新css
            if (oldVnode.props.style !== nextStyle) {
                Object.keys(nextStyle).forEach((s) => newVnode._hostNode.style[s] = nextStyle[s])
            }
        }
        if (typeof oldVnode.type === 'function') {//非原生

        }
    } else {
        renderByLuy(newVnode, parentDomNode, true)
    }
    return newVnode
}
/**
 * 渲染自定义组件
 * @param {*} Vnode 
 * @param {Element} parentDomNode 
 */
function renderComponent(Vnode, parentDomNode: Element) {
    const { type, props } = Vnode

    const Component = type
    const instance = new Component(props)
    console.log(instance)
    const renderedVnode = instance.render()
    if (!renderedVnode) console.warn('你可能忘记在组件render()方法中返回jsx了')
    const domNode = renderByLuy(renderedVnode, parentDomNode)
    instance.Vnode = renderedVnode
    instance.dom = domNode
    instance.Vnode._hostNode = domNode//用于在更新时期oldVnode的时候获取_hostNode

    return domNode
}

function mountNativeElement(Vnode, parentDomNode: Element) {
    const domNode = renderByLuy(Vnode, parentDomNode)
    Vnode._hostNode = domNode
    return domNode
}
function mountTextComponent(Vnode, domNode: Element) {
    let textDomNode = document.createTextNode(Vnode.props)
    domNode.appendChild(textDomNode)
    Vnode._hostNode = textDomNode
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



/**
 * ReactDOM.render()函数入口
 * 渲染组件，组件的子组件，都在这里
 * @param {*} Vnode 
 * @param {Element} container 
 * @param {boolean} isUpdate 
 */
let depth = 0
function renderByLuy(Vnode, container: Element, isUpdate: boolean) {
    mountIndex++
    Vnode._mountIndex = mountIndex
    const { type, props } = Vnode
    const { className, style, children } = props
    let domNode
    if (typeof type === 'function') {
        domNode = renderComponent(Vnode, container)
    } else if (typeof type === 'string' && type === '#text') {
        domNode = mountTextComponent(Vnode, container)
    } else {
        domNode = document.createElement(type)
    }

    if (children) {
        props.children = mountChild(children, domNode)//flatten之后的child 要保存下来
    }

    if (className !== undefined) {
        domNode.className = className
    }

    if (style !== undefined) {
        Object.keys(style).forEach((styleName) => {
            domNode.style[styleName] = style[styleName]
        })
    }

    if (isUpdate) {
        if (Vnode._hostNode) {
            container.insertBefore(domNode, Vnode._hostNode)
            container.removeChild(Vnode._hostNode)
        } else {
            container.appendChild(domNode)
        }

    } else {
        container.appendChild(domNode)
    }

    Vnode._hostNode = domNode
    return domNode
}

export function render(Vnode, container) {

    const rootDom = renderByLuy(Vnode, container)
    
    return rootDom
}