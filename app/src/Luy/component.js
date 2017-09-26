// @flow
import { instantiateReactComponent } from './vdom'

// 用户用来继承的 Component 类
class ReactClass {
  constructor(props, context) {
    this.props = props
    this.context = context
    this.state = this.state || {}

    this.nextState = null
    this._renderCallbacks = []
  }

  updateComponent() {
    const prevState = this.state
    const oldVnode = this.Vnode

    if (this.nextState !== prevState) {
      this.state = this.nextState;
    }

    this.nextState = null
    const nextVnode = this.render()
    this.Vnode = nextVnode
    let newComponent = instantiateReactComponent(nextVnode)
    newComponent.mountComponent()
  }
  setState(partialNewState, callback) {

    this.nextState = Object.assign({}, this.state, partialNewState)
    this.updateComponent()
  }

  render() { }
}

export {
  ReactClass,
}