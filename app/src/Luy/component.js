// @flow
// 用户用来继承的 Component 类
const dirtyComponents = []
let updateBatchNumber = 0

const updater = {
  enqueueSetState: function (instance, partialState) {
    const internalInstance = instance._reactInternalInstance

    if (!internalInstance) return
    const queue = internalInstance._pendingStateQueue ||
      (internalInstance._pendingStateQueue = [])

    queue.push(partialState)
    enqueueUpdate(internalInstance)
  },
}

const batchingStrategy = {
  isBatchingUpdates: false,

  batchedUpdates: function (callback, component) {
    const alreadyBatchingUpdates = this.isBatchingUpdates
    this.isBatchingUpdates = true

    if (alreadyBatchingUpdates) {
      callback(component)
    } else {
      this.runBatchUpdates()
    }
  },

  runBatchUpdates: function () {
    const len = dirtyComponents.length
    for (let i = 0; i < len; i++) {
      const component = dirtyComponents[i]
      component.updateComponent()
    }
  }
}

function enqueueUpdate(component) {
  if (!batchingStrategy.isBatchingUpdates) {
    batchingStrategy.batchedUpdates(enqueueUpdate, component)
    return
  }

  dirtyComponents.push(component)
  if (component._updateBatchNumber === null) {
    component._updateBatchNumber = updateBatchNumber + 1
  }
}


class ReactClass {
  constructor(props, context) {
    this.props = props
    this.context = context
    this.refs = {}
    this.state = this.state || {}
    this.updater = updater
  }
}

ReactClass.prototype.isReactComponent = {}

ReactClass.prototype.setState = function (partialState, callback) {
  if (typeof partialState !== 'object' && typeof partialState !== 'function') {
    throw new Error('setState(...): takes an object of state variables to update or a ' +
      'function which returns an object of state variables.')
  }
  this.updater.enqueueSetState(this, partialState)
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState')
  }
}

export {
    ReactClass,
}