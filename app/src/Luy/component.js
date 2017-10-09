// @flow
import { update } from './vdom'
import { options } from './utils'

export const Com = {
  CREATE: 0,//创造节点
  MOUNT: 1,//节点已经挂载
  UPDATING: 2,//节点正在更新
  UPDATED: 3,//节点已经更新
  MOUNTTING: 4//节点正在挂载
}

// 用户用来继承的 Component 类
class ReactClass {
  constructor(props, context) {
    this.props = props
    this.context = context
    this.state = this.state || {}

    this.nextState = null
    this._renderCallbacks = []
    this.lifeCycle = Com.CREATE
  }

  updateComponent() {

    const prevState = this.state
    const oldVnode = this.Vnode

    if (this.nextState !== prevState) {
      this.state = this.nextState;
    }

    if (this.componentWillUpdate) {
      this.componentWillUpdate(this.props, this.nextState, this.context)
    }

    this.nextState = null
    const newVnode = this.render()

    this.Vnode = update(oldVnode, newVnode, this.dom)//这个函数返回一个新的Vnode

    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props, prevState, this.context)
    }
  }

  /**
   * 事件触发的时候setState只会触发最后一个
   * 在componentdidmount的时候会全部合成
   * @param {*} partialNewState 
   * @param {*} callback 
   */
  setState(partialNewState, callback) {
    this.nextState = Object.assign({}, this.state, partialNewState)

    if (this.shouldComponentUpdate) {
      let shouldUpdate = this.shouldComponentUpdate(this.props, this.nextState, this.context)
      if (!shouldUpdate) {
        return
      }
    }


    if (this.lifeCycle === Com.CREATE) {
      //组件挂载期

    } else {
      //组件更新期

      if (options.async === true) {
        let dirty = options.dirtyComponent[this]
        if(!dirty){
          options.dirtyComponent[this] = this
        }
        return
      }

      this.updateComponent()
    }
  }

  // shouldComponentUpdate() { }
  componentWillReceiveProps() { }
  // componentWillUpdate() { }
  // componentDidUpdate() { }
  componentWillMount() { }
  componentDidMount() { }
  componentWillUnmount() { }
  componentDidUnmount() { }


  render() { }
}

export {
  ReactClass,
}