//@flow

let __type = Object.prototype.toString

export var options = {
  async: false,
  dirtyComponent: {}
}

var numberMap = {
  //null undefined IE6-8这里会返回[object Object]
  '[object Boolean]': 2,
  '[object Number]': 3,
  '[object String]': 4,
  '[object Function]': 5,
  '[object Symbol]': 6,
  '[object Array]': 7
}

/**
 * 给数字类的加上'px'
 * @param {*} styleNumber
 */
const specialStyle = {
  zIndex: 1
}
export function styleHelper(styleName, styleNumber) {
  if (typeNumber(styleNumber) === 3) {
    const style = specialStyle[styleName] ? styleNumber : styleNumber + 'px'
    return style
  }
  return styleNumber
}

/**
 * undefined: 0, null: 1, boolean:2, number: 3, string: 4, function: 5, symbol:6, array: 7, object:8
 * @param {any} data
 */
export function typeNumber(data) {
  if (data === null) {
    return 1
  }
  if (data === undefined) {
    return 0
  }
  var a = numberMap[__type.call(data)]
  return a || 8
}

/**
 * 对比新旧Vnode是否一样
 * @param {Vnode} pre
 * @param {Vnode} next
 */
export function isSameVnode(pre, next) {
  if (pre.type === next.type && pre.key === next.key) {
    return true
  }
  return false
}

/**
 * 将节点的key放入map中
 *
 * @param {Vnode} old
 */
export function mapKeyToIndex(old) {
  let hascode = {}
  old.forEach((el, index) => {
    if (el.key) {
      hascode[el.key] = index
    }
  })
  return hascode
}

/**
 * 判定否为与事件相关
 *
 * @param {any} name
 * @returns
 */
export function isEventName(name) {
  return /^on[A-Z]/.test(name)
}

export function isEventNameLowerCase(name) {
  return /^on[a-z]/.test(name)
}

/**
 * 展开对象
 * @param {*} obj
 * @param {*} props
 */
export function extend(obj, props) {
  for (let i in props) obj[i] = props[i]
  return obj
}

/**
 * 空函数
 */
export const noop = () => {}
