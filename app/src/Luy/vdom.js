//@flow
import { typeNumber } from "./utils";


function updateText(oldText, newText, parentDomNode: Element) {

    if (oldText !== newText) {

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


        if ((typeof oldChildVnode === 'string' && typeof newChildVnode === 'string') ||
            (typeof oldChildVnode === 'number' && typeof newChildVnode === 'number')
        ) {//如果虚拟节点是文字节点
            updateText(oldChildVnode, newChildVnode, parentDomNode)
        } else {//如果虚拟节点不是文字节点，直接去update
            console.log(newChildVnode)
            update(oldChildVnode, newChildVnode, parentDomNode)
        }

    }
}

export function update(oldVnode, newVnode, parentDomNode: Element) {

    if (oldVnode.type === newVnode.type) {
        if (typeof oldVnode.type === 'string') {//原生html
            const dom = parentDomNode
            newVnode.dom = dom

            updateChild(oldVnode.props.children, newVnode.props.children, parentDomNode)

            const nextStyle = newVnode.props.style;
            if (oldVnode.props.style !== nextStyle) {
                Object.keys(nextStyle).forEach((s) => dom.style[s] = nextStyle[s])
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

/**
 * ReactDOM.render()函数入口
 * 渲染组件，组件的子组件，都在这里
 * @param {*} Vnode 
 * @param {Element} container 
 * @param {boolean} isUpdate 
 */
function renderByLuy(Vnode, container: Element, isUpdate: boolean) {
    const { type, props } = Vnode
    const { className, style, children } = props
    let domNode
    if (typeof type !== 'function') {
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

    if (isUpdate) {
        console.log(container)
        container.removeChild()
        console.log(container)
        container.appendChild(domNode)
    } else {
        container.appendChild(domNode)
    }


    return domNode
}

export function render(Vnode, container) {
    const rootDom = renderByLuy(Vnode, container)
    console.log(Vnode)
    return rootDom
}