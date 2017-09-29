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
    
    if (oldChild.type === newChild.type && oldChild.type === "#text") {
        newChild._hostNode = oldChild._hostNode //更新一个dom节点
        updateText(oldChild, newChild)
        return newChild
    }
    if(oldChild.type === newChild.type && typeNumber(newChild) !==7){
        newChild._hostNode = oldChild._hostNode //更新一个dom节点
        update(oldChild,newChild,newChild._hostNode)
        return newChild
    }

    //如果不是array就转化成array
    if (!Array.isArray(oldChild)) {
        oldChild = [oldChild]
    }
    if (!Array.isArray(newChild)) {
        newChild = [newChild]
    }

    let hash = {}
    let updateQueue = []
    let removedQueue = []
    let insertQueue = []
    let keyed = []
    oldChild.forEach((item) => {
        
        if (item.key) {
            hash[item.key] = item
        } else {
            removedQueue.push(item)
        }
    })
    
    newChild.forEach((newVnode, index) => {
        
        let oldVnode = hash[newVnode.key]
        if (oldVnode) {//如果存在key相同的，则看看是否需要update
            update(oldVnode, newVnode, newVnode._hostNode)
            keyed.push({
                Vnode: oldVnode,
                index: index
            })

            newVnode._mountIndex = oldVnode._mountIndex //让新的也拥有同样的mountIndex
        }
    })
    
    let One = keyed.shift()
    if(One){
        newChild.forEach((item, index) => {
            
            if(index < One.index && One.index !== index){
                
                let dom = renderByLuy(item,parentDomNode,true)
                parentDomNode.insertBefore(dom,One.Vnode._hostNode)
            }
            if(keyed.length === 0 &&One.index < index && One.index !== index){
             let dom = renderByLuy(item,parentDomNode,true)
             parentDomNode.appendChild(dom)
            }
            if(keyed.length !== 0 && One.index === index )One = keyed.shift()
         })
         removedQueue.forEach((item) => {
            // parentDomNode.removeChild(item._hostNode)
        })    
    }else{
        
        newChild.forEach((item)=>{
            let dom = renderByLuy(item,parentDomNode,true)
            parentDomNode.appendChild(dom)
        })
        oldChild.forEach((item) => {
            parentDomNode.removeChild(item._hostNode)
        })
    
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
        
       let dom = renderByLuy(newVnode, parentDomNode, true)
       if(newVnode._hostNode){
        parentDomNode.insertBefore(dom,newVnode._hostNode)
        parentDomNode.removeChild(newVnode._hostNode)
       }else{
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
function renderComponent(Vnode, parentDomNode: Element) {
    const { type, props } = Vnode

    const Component = type
    const instance = new Component(props)

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

    Vnode._hostNode = domNode

    if (isUpdate) {
        return domNode
    } else {
        container.appendChild(domNode)
    }
    return domNode
}

export function render(Vnode, container) {
    const rootDom = renderByLuy(Vnode, container)
    return rootDom
}