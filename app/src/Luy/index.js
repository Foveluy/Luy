//@flow
import { createElement } from './createElement'
import { cloneElement } from './cloneElement'
import { Children } from './Children'
import { render, findDOMNode, createPortal } from './vdom'
import { ReactClass } from './component'

const React = {
    findDOMNode,
    createElement,/** babel的默认设置是调用createElement这个函数 */
    render,
    cloneElement,
    Children,
    Component: ReactClass,
}


export default React