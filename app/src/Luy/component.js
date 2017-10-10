// @flow
import { update } from './vdom'
import { options, extend } from './utils'

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
    this.stateMergeQueue = []
    this.refs = {}
  }

  updateComponent() {

    const prevState = this.state
    const oldVnode = this.Vnode
    const oldContext = this.context

    if (this.nextState !== prevState) {
      this.state = this.nextState;
    }
    if (this.getChildContext) {
      this.context = extend(extend({}, this.context), this.getChildContext());
    }

    if (this.componentWillUpdate) {
      this.componentWillUpdate(this.props, this.nextState, this.context)
    }

    this.nextState = null
    const newVnode = this.render()

    this.Vnode = update(oldVnode, newVnode, this.dom, this.context)//这个函数返回一个新的Vnode

    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props, prevState, oldContext)
    }
  }

  _updateInLifeCycle() {
    if (this.stateMergeQueue.length > 0) {
      this.nextState = { ...this.state }
      this.stateMergeQueue = []
      this.updateComponent()
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
      if (this.lifeCycle === Com.MOUNTTING) {
        //componentDidMount的时候调用setState
        this.state = Object.assign({}, this.state, partialNewState)
        this.stateMergeQueue.push(1)
        return
      }

      if (options.async === true) {
        //事件中调用
        let dirty = options.dirtyComponent[this]
        if (!dirty) {
          options.dirtyComponent[this] = this
        }
        return
      }

      //不在生命周期中调用，有可能是异步调用
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