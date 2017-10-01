// @flow
import {update} from './vdom'
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
    const newVnode = this.render()

    
    this.Vnode = update(oldVnode, newVnode, this.dom)//这个函数返回一个新的Vnode

 
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