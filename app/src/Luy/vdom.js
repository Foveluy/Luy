//@flow
import { typeNumber } from "./utils";


export function update(oldVnode, newVnode, parentDomNode) {
    
    if (oldVnode.type === newVnode.type) {
        if (typeof oldVnode.type === 'string') {
            const dom = parentDomNode

            newVnode.dom = dom

            console.log(newVnode)
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