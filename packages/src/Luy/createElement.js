import { typeNumber } from './utils'
import { currentOwner } from './vdom'

const RESERVED_PROPS = {
  ref: true,
  key: true,
  __self: true,
  __source: true
}

function Vnode(type, props, key, ref, VnodeType) {
  this.owner = currentOwner.cur
  this.type = type
  this.props = props
  this.key = key
  this.ref = ref
  this.VnodeType = VnodeType
}

/**
 * 创建虚拟Dom的地方
 * @param {string | Function} type
 * @param {object} config
 * @param {array} children
 */
function createElement(type, config, ...children) {
  let props = {},
    key = null,
    ref = null,
    childLength = children.length

  if (config != null) {
    //巧妙的将key转化为字符串
    key = config.key === undefined ? null : '' + config.key
    ref = config.ref === undefined ? null : config.ref

    /**这一步讲外部的prop属性放进prop里 */
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
  let defaultProps = type.defaultProps
  if (defaultProps) {
    for (let propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName]
      }
    }
  }
  return new Vnode(type, props, key, ref, typeNumber(type))
}

/**
 * 实际上这里做的事情就是将文字节点全部转换成Vnode
 * @param {*} children
 */
export function flattenChildren(children, parentVnode) {
  if (children === undefined) return new Vnode('#text', '', null, null)

  let length = children.length
  let ary = [],
    isLastSimple = false, //判断上一个元素是否是string 或者 number
    lastString = '',
    childType = typeNumber(children)

  if (childType === 4 || childType === 3) {
    return new Vnode('#text', children, null, null)
  }

  if (childType !== 7) {
    if (parentVnode) children.return = parentVnode
    return children
  }

  children.forEach((item, index) => {
    if (typeNumber(item) === 7) {
      if (isLastSimple) {
        ary.push(lastString)
      }
      item.forEach(item => {
        ary.push(item)
      })
      lastString = ''
      isLastSimple = false
    }
    if (typeNumber(item) === 3 || typeNumber(item) === 4) {
      lastString += item
      isLastSimple = true
    }
    if (typeNumber(item) !== 3 && typeNumber(item) !== 4 && typeNumber(item) !== 7) {
      if (isLastSimple) {
        //上一个节点是简单节点
        ary.push(lastString)
        ary.push(item)
        lastString = ''
        isLastSimple = false
      } else {
        ary.push(item)
      }
    }
    if (length - 1 === index) {
      if (lastString) ary.push(lastString)
    }
  })
  ary = ary.map(item => {
    if (typeNumber(item) === 4) {
      item = new Vnode('#text', item, null, null)
    } else {
      if (item) {
        //首先判断是否存在
        if (typeNumber(item) !== 3 && typeNumber(item) !== 4) {
          //再判断是不是字符串，或者数字
          //不是就加上return
          if (parentVnode) item.return = parentVnode
        }
      }
    }
    return item
  })

  return ary
}

export { createElement, Vnode }
