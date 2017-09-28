//@flow
import { typeNumber } from "./utils";
import { flattenChildren } from './createElement'

function updateText(oldText, newText, parentDomNode: Element) {

    if (oldText !== newText) {
        // parentDomNode.removeChild(Vnode._hostNode)
        // container.appendChild(domNode)
        console.log(oldText)
        parentDomNode.firstChild.nodeValue = newText
    }
}

function updateChild(oldChild, newChild, parentDomNode: Element) {
    let dom = newChild
    //如果不是array就转化成array
    if (!Array.isArray(oldChild)) {
        oldChild = [oldChild]
    }
    if (!Array.isArray(newChild)) {
        newChild = [newChild]
    }

    let TwoMaxlength = Math.max(oldChild.length, newChild.length)

    for (let i = 0; i < TwoMaxlength; i++) {
        const oldChildVnode = oldChild[i]
        const newChildVnode = newChild[i]
        console.log(oldChildVnode)

        if ((typeof oldChildVnode === 'string' && typeof newChildVnode === 'string') ||
            (typeof oldChildVnode === 'number' && typeof newChildVnode === 'number')
        ) {//如果虚拟节点是文字节点
            updateText(oldChildVnode, newChildVnode, parentDomNode)
        } else {//如果虚拟节点不是文字节点，直接去update
            update(oldChildVnode, newChildVnode, parentDomNode)
        }

    }
}

export function update(oldVnode, newVnode, parentDomNode: Element) {

    newVnode._hostNode = oldVnode._hostNode
    if (oldVnode.type === newVnode.type) {
        if (typeof oldVnode.type === 'string') {//原生html

            updateChild(oldVnode.props.children, newVnode.props.children, newVnode._hostNode)


            const nextStyle = newVnode.props.style;
            //更新css
            if (oldVnode.props.style !== nextStyle) {
                Object.keys(nextStyle).forEach((s) => newVnode._hostNode.style[s] = nextStyle[s])
            }
        }
        if (typeof oldVnode.type === 'function') {//非原生

        }
    } else {
        /**整个元素都不同了，直接删除再插入一个新的 */
        if (typeof newVnode.type === 'string') { //新的元素是html原生元素
            renderByLuy(newVnode, parentDomNode, true)
        }
        if (typeof newVnode.type === 'function') {//非原生

        }
    }
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
    const renderedVnode = instance.render()
    if (!renderedVnode) console.warn('你可能忘记在组件render()方法中返回jsx了')
    const domNode = renderByLuy(renderedVnode, parentDomNode)
    instance.Vnode = renderedVnode
    instance.dom = domNode
    instance.Vnode._hostNode = domNode

    return domNode
}

function mountNativeElement(Vnode, parentDomNode: Element) {
    const domNode = renderByLuy(Vnode, parentDomNode)
    Vnode._hostNode = domNode
}
function mountTextComponent(Vnode, domNode: Element) {
    let textDomNode = document.createTextNode(Vnode.props)
    domNode.appendChild(textDomNode)
    Vnode._hostNode = textDomNode
    return textDomNode
}

function mountChild(childrenVnode, parentDomNode: Element) {
    let childType = typeNumber(childrenVnode)
    if (childType === 8) { //Vnode
        mountNativeElement(childrenVnode, parentDomNode)
    }
    if (childType === 7) {//list
        let flattenChildList = flattenChildren(childrenVnode)
        flattenChildList.forEach((item) => {
            renderByLuy(item, parentDomNode)
        })
    }
    if (childType === 4 || childType === 3) {//string or number
        mountTextComponent(flattenChildren(childrenVnode), parentDomNode)
    }
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
    const { type, props } = Vnode
    const { className, style, children } = props
    let domNode
    if (typeof type === 'function') {
        domNode = renderComponent(Vnode, container)
    } else if (typeof type === 'string' && type === '#text') {
        domNode = mountTextComponent(Vnode,container)
    } else {
        domNode = document.createElement(type)
        
    }

    if (children) {
        mountChild(children, domNode)
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
        container.removeChild(Vnode._hostNode)
        container.appendChild(domNode)
    } else {
        container.appendChild(domNode)
    }


    return domNode
}

export function render(Vnode, container) {
    const rootDom = renderByLuy(Vnode, container)

    return rootDom
}