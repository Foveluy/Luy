class ReactCompositeComponent {
    constructor(element) {
      this._currentElement = element
      this._rootNodeId = 0
      this._instance = null
      this._hostParent = null
      this._hostContainerInfo = null
      this._context = null
  
      this._renderedComponent = null
      this._updateBatchNumber = null
      this._pendingStateQueue = null
      this._pendingCallbacks = null
    }
  
    mountComponent(hostParent, hostContainerInfo, context) {
      this._context = context
      this._hostParent = hostParent
      this._hostContainerInfo = hostContainerInfo
  
      const Component = this._currentElement.type
      const publicProps = this._currentElement.props
      const publicContext = this._processContext(context)
      const ins = new Component(publicProps, publicContext)
  
      ins.props = publicProps
      ins.context = publicContext
      ins.refs = {}
  
      this._instance = ins
      ins._reactInternalInstance = this
  
      let initialState = ins.state
      if (initialState === undefined) {
        ins.state = initialState = null
      }
  
      const markup = this._initialMount(hostParent, hostContainerInfo, context)
      return markup
    }
  
    updateComponent() {
    }
  
    _initialMount(hostParent, hostContainerInfo, context) {
      const ins = this._instance
  
      if (ins.componentWillMount) {
        ins.componentWillMount()
  
        if (this._pendingStateQueue) {
          ins.state = this._processPendingState(ins.props, ins.context)
        }
      }
  
      const renderedElement = ins.render()
      const renderedComponent = instantiateReactComponent(renderedElement)
  
      this._renderedComponent = renderedComponent
      const childContext = this._processChildContext(context)
      const markup = renderedComponent.mountComponent(hostParent, hostContainerInfo, childContext)
  
      return markup
    }
  
    _processPendingState() {
      const ins = this._instance
      const queue = this._pendingStateQueue
      this._pendingStateQueue = null
  
      if (!queue) {
        return ins.state
      }
  
      const nextState = ins.state
      for (let i = 0; i < queue.length; i++) {
        const partial = queue[i]
        Object.assign(nextState, partial)
      }
  
      return nextState
    }
  
    _processContext(context) {
      const Component = this._currentElement.type
      const contextTypes = Component.contextTypes
      if (!contextTypes) {
        return {}
      }
      const maskedContext = {}
      for (let name in contextTypes) {
        maskedContext[name] = context[name]
      }
      return maskedContext
    }
  
    _processChildContext(currentContext) {
      const ins = this._instance
      let childContext = null
  
      if (ins.getChildContext) {
        childContext = ins.getChildContext()
      }
      if (childContext) {
        return Object.assign({}, currentContext, childContext)
      }
      return currentContext
    }
  }


class ReactDOMEmptyComponent {
    constructor() {
        this._currentElement = null
        this._hostNode = null
        this._hostParent = null
        this._hostContainerInfo = null
        this._domId = 0
    }

    mountComponent(hostParent, hostContainerInfo, context) {
        this._context = context
        this._hostParent = hostParent
        this._hostContainerInfo = hostContainerInfo
        this._domId = hostContainerInfo._idCounter++

        return ''
    }
}

class ReactDOMTextComponent {
    constructor(text) {
        this._currentElement = text
        this._stringText = '' + text
        this._hostNode = null
        this._hostParent = null

        this.domID = 0
        this._mountIndex = 0
    }

    mountComponent(hostParent, hostContainerInfo) {
        const domID = hostContainerInfo._idCounter++

        this._domID = domID
        this._hostParent = hostParent

        const openingValue = '<!-- react-text: ' + domID + ' -->'
        const closingValue = '<!-- /reatc-text -->'
        return openingValue + this._stringText + closingValue
    }
}

let globalIdCounter = 1

class ReactDomComponent {
    constructor(element) {
        let tag = element.type

        this._currentElement = element
        this._tag = tag.toLowerCase()
        this._domID = 0
        this._rootNodeID = 0
        this._hostParent = null
        this._hostContainerInfo = null
        this._renderedChildren = null
    }

    _mountChildren(props, context) {
        let innerHTML = props.dangerouslySetInnerHTML
        if (innerHTML == null) {
            innerHTML = ''
            this._renderedChildren = []
            const children = props.children
            for (let index in children) {
                const child = children[index]
                const childrenComponent = instantiateReactComponent(child)
                this._renderedChildren.push(childrenComponent)
                innerHTML += childrenComponent.mountComponent(this._hostParent, this._hostContainerInfo, context)
            }
        }

        return innerHTML
    }

    mountComponent(hostParent, hostContainerInfo, context) {
        this._hostParent = hostParent
        this._hostContainerInfo = hostContainerInfo
        this._domID = hostContainerInfo._idCounter++
        this._rootNodeID = globalIdCounter++

        let ret = `<${this._tag} `
        let props = this._currentElement.props
        for (var propsName in props) {
            if (propsName === 'children') {
                continue
            }
            let propsValue = props[propsName]
            ret += `${propsName}=${propsValue}`
        }
        ret += '>'

        let tagContent = ''
        if (props.children) {
            tagContent = this._mountChildren(props, context)
        }
        ret += tagContent
        ret += `</${this._tag}>`
        return ret
    }
}

export function instantiateReactComponent(element) {
    let instance = null
    if (element === null || element === false) {
        instance = new ReactDOMEmptyComponent()
    }

    if (typeof element === 'string' || typeof element === 'number') {
        instance = new ReactDOMTextComponent(element)
    }

    if (typeof element === 'object') {
        let type = element.type
        if (typeof type === 'string') {
            instance = new ReactDomComponent(element)
        } else if (typeof type === 'function') {
            instance = new ReactCompositeComponent(element)
        }
    }
    return instance
}


export function render(element, container) {
    const rootID = 0
    const mainComponent = instantiateReactComponent(element)
    const containerContent = mainComponent.mountComponent(rootID)

    container.innerHTML = containerContent
}