import { typeNumber } from "./utils";


const RESERVED_PROPS = {
    ref: true,
    key: true,
    __self: true,
    __source: true,
}


class Vnode {
    constructor(type, props, key, ref) {
        this.type = type
        this.props = props
        this.key = key
        this.ref = ref
    }
}

/**
 * 创建虚拟Dom的地方
 * @param {string | Function} type 
 * @param {object} config 
 * @param {array} children 
 */
function createElement(type: string | Function, config, ...children: array) {
    let props = {},
        key = null,
        ref = null,
        childLength = children.length;

    if (config != null) {
        //巧妙的将key转化为字符串
        key = config.key === undefined ? null : '' + config.key
        ref = config.ref === undefined ? null : config.ref
        
        for (let propName in config) {

            // 除去一些不需要的属性,key,ref等
            if (RESERVED_PROPS.hasOwnProperty(propName)) continue
            //保证所有的属性都不是undefined
            if (config.hasOwnProperty(propName)) {
                props[propName] = config[propName]
            }
            
        }
    }

    if (childLength === 1) {
        props.children = typeNumber(children[0]) > 2 ? children[0] : []

    } else if (childLength > 1) {
        props.children = children
    }

    /**设置defaultProps */
    let defaultProps = type.defaultProps;
    if (defaultProps) {
        for (let propName in defaultProps) {
            if (props[propName] === 'undefined') {
                props[propName] = defaultProps[propName];
            }
        }
    }
    return new Vnode(type, props, key, ref);
}

export {
    createElement,
    Vnode
}