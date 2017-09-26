// @flow
// 用户用来继承的 Component 类
class ReactClass {
  constructor(props, context) {
    this.props = props
    this.context = context
    this.state = this.state || {}

    this._prevState = null
    this._renderCallbacks = []
  }

  setState(updater, callback) {
    let state = this.state
    if (!this._prevState) {
      this._prevState = extend({}, state)
    }

    // When the first argument is an updater function
    if (typeof updater === 'function') {
      updater = updater(state, this.props)
    }
    extend(state, updater)

    if (callback) {
      this._renderCallbacks.push(callback)
    }
  }

  render() {}
}

export {
    ReactClass,
}