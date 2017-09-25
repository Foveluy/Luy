//@flow
import { createElement } from './createElement'
import { render } from './vdom'
import {ReactClass} from './component'

const React = {
    createElement,/** babel的默认设置是调用createElement这个函数 */
    render,
    Component: ReactClass,
}

export default React