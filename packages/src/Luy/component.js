// @flow
import { update, currentOwner } from './vdom'
import { options, extend } from './utils'
import { Vnode } from './createElement'
import { catchError } from './ErrorBoundary'

export const Com = {
  CREATE: 0, //创造节点
  MOUNT: 1, //节点已经挂载
  UPDATING: 2, //节点正在更新
  UPDATED: 3, //节点已经更新
  MOUNTTING: 4, //节点正在挂载,
  CATCHING: 5
}

var uniqueId = 0
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
    this._penddingState = []
    this.refs = {}
    this._uniqueId = uniqueId
    uniqueId++
  }

  updateComponent() {
    const prevState = this.state
    const oldVnode = this.Vnode
    const oldContext = this.context

    this.nextState = this.state
    for (let index in this._penddingState) {
      const item = this._penddingState[index]
      if (typeof item.partialNewState === 'function') {
        this.nextState = Object.assign({}, this.nextState, item.partialNewState(this.nextState, this.props))
      } else {
        this.nextState = Object.assign({}, this.state, item.partialNewState)
      }
    }

    if (this.nextState !== prevState) {
      this.state = this.nextState
    }
    if (this.getChildContext) {
      this.context = extend(extend({}, this.context), this.getChildContext())
    }

    if (this.componentWillUpdate) {
      catchError(this, 'componentWillUpdate', [this.props, this.nextState, this.context])
    }

    var lastOwner = currentOwner.cur
    currentOwner.cur = this
    this.nextState = null
    let newVnode = this.render()

    newVnode = newVnode ? newVnode : new Vnode('#text', '', null, null)
    currentOwner.cur = lastOwner
    this.Vnode = update(oldVnode, newVnode, this.Vnode._hostNode, this.context) //这个函数返回一个更新后的Vnode

    if (this.componentDidUpdate) {
      catchError(this, 'componentDidUpdate', [this.props, prevState, oldContext])
    }

    this._penddingState.forEach(item => {
      if (typeof item.callback === 'function') {
        item.callback(this.state, this.props)
      }
    })

    this._penddingState = []
  }

  _updateInLifeCycle() {
    if (this.stateMergeQueue.length > 0) {
      let tempState = this.state
      this._penddingState.forEach(item => {
        tempState = Object.assign({}, tempState, ...item.partialNewState)
      })
      this.nextState = { ...tempState }
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
    this._penddingState.push({ partialNewState, callback })

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
      if (this.lifeCycle === Com.UPDATING) {
        return
      }

      if (this.lifeCycle === Com.MOUNTTING) {
        //componentDidMount的时候调用setState
        this.stateMergeQueue.push(1)
        return
      }

      if (this.lifeCycle === Com.CATCHING) {
        //componentDidMount的时候调用setState
        this.stateMergeQueue.push(1)
        return
      }

      if (options.async === true) {
        //事件中调用
        let dirty = options.dirtyComponent[this._uniqueId]
        if (!dirty) {
          options.dirtyComponent[this._uniqueId] = this
        }
        return
      }

      //不在生命周期中调用，有可能是异步调用
      this.updateComponent()
    }
  }

  // shouldComponentUpdate() { }
  componentWillReceiveProps() {}
  // componentWillUpdate() { }
  // componentDidUpdate() { }
  componentWillMount() {}
  componentDidMount() {}
  componentWillUnmount() {}
  componentDidUnmount() {}

  render() {}
}

ReactClass.prototype.isReactComponent = true

export { ReactClass }
