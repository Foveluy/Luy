//@flow
import { typeNumber } from "./utils";
/**
 * 没什么好说的，空的节点，自然返回的是空的字符串
 * 其实react官方对于空的节点会返回一段注释...
 */
class ReactDOMEmptyComponent {
    constructor() {
        this.Vnode = null
    }
    mountComponent() {
        return ''
    }
}

/**
 * 文字节点，直接渲染文字就好，没什么别的东西可说的
 * @param {string} text
 */
class ReactDOMTextComponent {
    constructor(text: string) {
        this.Vnode = text//记录Vnode
        this._stringText = text
        this._rootID = 0//暂时不知道是干嘛的
    }

    mountComponent() {
        return this._stringText
    }
}

/**
 * 原生节点,div,span,etc...
 * @param {Vnode} Vnode
 */
class ReactDomComponent {
    constructor(Vnode) {
        let HTMLTag: string = Vnode.type
        this.Vnode = Vnode
        this._tag = HTMLTag.toLowerCase()//全部变成小写
    }
    mountComponent() {
        let result: string = `<${this._tag}`
        let props = this.Vnode.props
        for (let propsName in props) {
            //去掉名字为children的属性
            if (propsName === 'children') continue
            let propsValue = props[propsName]
            result += `${propsName}=${propsValue}`
        }
        result += '>'

        /**递归渲染子节点 */
        let childrenResult = ''
        if (props.children) {
            childrenResult = this.mountChildren(props.children)
        }
        result += childrenResult
        result += `</${this._tag}>`
        return result
    }

    mountChildren(child) {
        let result = ''
        /**判断子节点的类型 */
        let childType = typeNumber(child)
        if (childType === 7) {
            for (let i in child) {
                const childrenComponent = instantiateReactComponent(child[i])
                result += childrenComponent.mountComponent()
            }
        } else {
            const childrenComponent = instantiateReactComponent(child)
            result += childrenComponent.mountComponent()
        }
        return result
    }

}


class ReactCompositeComponent {
    constructor(element) {
        this._element = element
    }

    mountComponent(rootID) {
        /**此时的type是一个function或者就是es6的class(ReactClass) */
        const Component = this._element.type
        const props = this._element.props
        const instance = new Component(props)

        /**当我们调用这个class的render()函数的时候，babel就会帮我们把这个函数之中的jsx转化成Vnode*/
        const renderedElement = instance.render()
        const renderedComponent = instantiateReactComponent(renderedElement)
        const renderedResult = renderedComponent.mountComponent(rootID)
        return renderedResult
    }
}

/**
 * 生成一个组件的实例，是一个react节点，mountComponent()方法被定义为返回其HTML字符串
 * @param {ReactElement|string|number|false|null} Vnode 
 */
function instantiateReactComponent(Vnode) {
    /**定义一个实例 */
    let instance = null
    /**空节点，直接制造一个空的react component */
    if (Vnode === null || Vnode === false) {
        instance = new ReactDOMEmptyComponent()
    }
    /**文字节点，得到一个文字节点字符串 */
    if (typeof Vnode === 'string' || typeof Vnode === 'number') {
        instance = new ReactDOMTextComponent(Vnode)
    }
    /**
     * 是否是一个原生节点或者自定义节点 
     * 原生:div,span,h,p
     * 自定义:<Shit/><Fuck/><Cao/>
     */
    if (typeof Vnode === 'object') {
        let type = Vnode.type
        //原生节点的type是string
        if (typeof type === 'string') {
            instance = new ReactDomComponent(Vnode)
            //自定义节点是由一个函数(class)组成的
        } else if (typeof type === 'function') {
            instance = new ReactCompositeComponent(Vnode)
        }
    }

    return instance
}

export function render(element, container) {
    console.log(element)
    const mainComponent = instantiateReactComponent(element)
    const containerContent = mainComponent.mountComponent()

    container.innerHTML = containerContent
}