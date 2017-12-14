//@flow
import { createElement as createEle } from './createElement'
import { cloneElement } from './cloneElement'
import { Children as child } from './Children'
import { render, findDOMNode, createPortal } from './vdom'
import { ReactClass } from './component'

const React = {
    findDOMNode,
    createElement: createEle,/** babel的默认设置是调用createElement这个函数 */
    render,
    cloneElement,
    createPortal,
    Children: child,
    Component: ReactClass
}
export const Component = ReactClass
export const Children = child
export const createElement = createEle
export default React