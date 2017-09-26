//@flow
import { typeNumber } from "./utils";


function updateText(oldText, newText, parentDomNode: Element) {

    if (oldText !== newText) {
        parentDomNode.firstChild.nodeValue = newText
    }
}

function updateChild(oldChild, newChild, parentDomNode) {
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


        if ((typeof oldChildVnode === 'string' && typeof newChildVnode === 'string') ||
            (typeof oldChildVnode === 'number' && typeof newChildVnode === 'number')
        ) {//如果虚拟节点是文字节点
            updateText(oldChildVnode, newChildVnode, parentDomNode)
        } else {//如果虚拟节点不是文字节点，直接去update
            console.log(oldChildVnode, newChildVnode)
            update(oldChildVnode, newChildVnode, parentDomNode)
        }

    }
}

export function update(oldVnode, newVnode, parentDomNode: Element) {

    if (oldVnode.type === newVnode.type) {
        if (typeof oldVnode.type === 'string') {//原生html
            const dom = parentDomNode
            newVnode.dom = dom

            console.log(oldVnode)
            updateChild(oldVnode.props.children, newVnode.props.children, parentDomNode)

            const nextStyle = newVnode.props.style;
            if (oldVnode.props.style !== nextStyle) {
                Object.keys(nextStyle).forEach((s) => dom.style[s] = nextStyle[s])
            }
        }
    } else {
        /**整个元素都不同了，直接替换 */

    }
}

function renderComponent(Vnode, parentDomNode) {
    const { type, props } = Vnode
    const Component = type
    const instance = new Component(props)
    const renderedVnode = instance.render()

    const domNode = renderByLuy(renderedVnode, parentDomNode)
    instance.Vnode = renderedVnode
    instance.dom = domNode

    return domNode
}



function renderByLuy(Vnode, container) {
    const { type, props } = Vnode
    const { className, style, children } = props
    let domNode
    if (typeNumber(type) !== 5) {
        domNode = document.createElement(type)
    } else {
        domNode = renderComponent(Vnode, container)
    }

    if (children) {
        let childType = typeNumber(children)
        if (childType === 8) { //Vode
            renderByLuy(children, domNode)
        }
        if (childType === 7) {//list
            props.children.forEach((item) => {
                console.log(item)
                renderByLuy(item, domNode)
            })
        }
        if (childType === 4 || childType === 3) {//string or number
            domNode.textContent = children
        }
    }

    if (className !== undefined) {
        domNode.className = className
    }

    if (style !== undefined) {
        Object.keys(style).forEach((styleName) => {
            domNode.style[styleName] = style[styleName]
        })
    }

    container.appendChild(domNode)

    return domNode
}

export function render(Vnode, container) {
    return renderByLuy(Vnode, container)
}