//@flow
import { createElement } from './createElement'
import { render, findDOMNode } from './vdom'
import { ReactClass } from './component'

const React = {
    findDOMNode,
    createElement,/** babel的默认设置是调用createElement这个函数 */
    render,
    Component: ReactClass,
}

export default React