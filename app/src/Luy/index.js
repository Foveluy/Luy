//@flow
import { createElement } from './createElement'
import { render, findDOMNode, createPortal } from './vdom'
import { ReactClass } from './component'

const React = {
    findDOMNode,
    createElement,/** babel的默认设置是调用createElement这个函数 */
    render,
    createPortal,
    Component: ReactClass,
}

export default React