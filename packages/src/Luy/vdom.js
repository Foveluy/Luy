//@flow
import { typeNumber, isSameVnode, mapKeyToIndex, isEventName, extend, options } from './utils'
import { flattenChildren, Vnode as VnodeClass } from './createElement'
import { mapProp, mappingStrategy, updateProps } from './mapProps'
import { setRef } from './Refs'
import { disposeVnode } from './dispose'
import { Com } from './component'
import { catchError, collectErrorVnode, getReturn, runException, globalError } from './ErrorBoundary'

//Top Api
export function createPortal(children, container) {
  let domNode
  if (container) {
    if (Array.isArray(children)) {
      domNode = mountChild(children, container)
    } else {
      domNode = render(children, container)
    }
  } else {
    throw new Error('请给portal一个插入的目标')
  }
  //用于记录Portal的事物
  // let lastOwner = currentOwner.cur;
  // currentOwner.cur = instance;

  const CreatePortalVnode = new VnodeClass('#text', 'createPortal', null, null)
  CreatePortalVnode._PortalHostNode = container
  return CreatePortalVnode
}

let mountIndex = 0 //全局变量
var containerMap = {}
export var currentOwner = {
  cur: null
}

function instanceProps(componentVnode) {
  return {
    oldState: componentVnode._instance.state,
    oldProps: componentVnode._instance.props,
    oldContext: componentVnode._instance.context,
    oldVnode: componentVnode._instance.Vnode
  }
}

function mountIndexAdd() {
  return mountIndex++
}

function updateText(oldTextVnode, newTextVnode, parentDomNode) {
  let dom = oldTextVnode._hostNode
  if (oldTextVnode.props !== newTextVnode.props) {
    dom.nodeValue = newTextVnode.props
  }
}

function updateChild(oldChild, newChild, parentDomNode, parentContext) {
  newChild = flattenChildren(newChild)
  oldChild = oldChild || []
  if (!Array.isArray(oldChild)) oldChild = [oldChild]
  if (!Array.isArray(newChild)) newChild = [newChild]

  let oldLength = oldChild.length,
    newLength = newChild.length,
    oldStartIndex = 0,
    newStartIndex = 0,
    oldEndIndex = oldLength - 1,
    newEndIndex = newLength - 1,
    oldStartVnode = oldChild[0],
    newStartVnode = newChild[0],
    oldEndVnode = oldChild[oldEndIndex],
    newEndVnode = newChild[newEndIndex],
    hascode

  if (newLength >= 0 && !oldLength) {
    newChild.forEach((newVnode, index) => {
      renderByLuy(newVnode, parentDomNode, false, parentContext)
      newChild[index] = newVnode
    })
    return newChild
  }
  if (!newLength && oldLength >= 0) {
    oldChild.forEach(oldVnode => {
      disposeVnode(oldVnode)
    })
    return newChild[0]
  }

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (oldStartVnode === undefined || oldStartVnode === null) {
      oldStartVnode = oldChild[++oldStartIndex]
    } else if (oldEndVnode === undefined || oldEndVnode === null) {
      oldEndVnode = oldChild[--oldEndIndex]
    } else if (newStartVnode === undefined || newStartVnode === null) {
      newStartVnode = newChild[++newStartIndex]
    } else if (newEndVnode === undefined || newEndVnode === null) {
      newEndVnode = newChild[--newEndIndex]
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      update(oldStartVnode, newStartVnode, newStartVnode._hostNode, parentContext)
      oldStartVnode = oldChild[++oldStartIndex]
      newStartVnode = newChild[++newStartIndex]
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      update(oldEndVnode, newEndVnode, newEndVnode._hostNode, parentContext)
      oldEndVnode = oldChild[--oldEndIndex]
      newEndVnode = newChild[--newEndIndex]
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      let dom = oldStartVnode._hostNode
      parentDomNode.insertBefore(dom, oldEndVnode._hostNode.nextSibling)
      update(oldStartVnode, newEndVnode, oldStartVnode._hostNode._hostNode, parentContext)
      oldStartVnode = oldChild[++oldStartIndex]
      newEndVnode = newChild[--newEndIndex]
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      let dom = oldEndVnode._hostNode
      parentDomNode.insertBefore(dom, oldStartVnode._hostNode)
      update(oldStartVnode, newEndVnode, oldStartVnode._hostNode, parentContext)
      oldEndVnode = oldChild[--oldEndIndex]
      newStartVnode = newChild[++newStartIndex]
    } else {
      if (hascode === undefined) hascode = mapKeyToIndex(oldChild)

      let indexInOld = hascode[newStartVnode.key]

      if (indexInOld === undefined) {
        if (newStartVnode.type === '#text') {
          update(oldStartVnode, newStartVnode, parentDomNode, parentContext)
        } else {
          let _parentDomNode = parentDomNode
          if (parentDomNode.nodeName === '#text') {
            _parentDomNode = parentDomNode.parentNode
          }
          if (oldStartVnode.type === '#text') {
            _parentDomNode = parentDomNode.parentNode
          }
          let newElm = renderByLuy(newStartVnode, _parentDomNode, true, parentContext)
          _parentDomNode.insertBefore(newElm, oldStartVnode._hostNode)
        }

        newStartVnode = newChild[++newStartIndex]
      } else {
        let moveVnode = oldChild[indexInOld]
        update(moveVnode, newStartVnode, moveVnode._hostNode, parentContext)
        parentDomNode.insertBefore(moveVnode._hostNode, oldStartVnode._hostNode)
        oldChild[indexInOld] = undefined
        newStartVnode = newChild[++newStartIndex]
      }
    }
    if (oldStartIndex > oldEndIndex) {
      for (; newStartIndex - 1 < newEndIndex; newStartIndex++) {
        if (newChild[newStartIndex]) {
          let newDomNode = renderByLuy(newChild[newStartIndex], parentDomNode, true, parentContext)
          parentDomNode.appendChild(newDomNode)
          // if (oldChild[oldChild.length - 1]) {

          // } else {
          //     parentDomNode.insertBefore(newDomNode, oldChild[oldChild.length - 1]._hostNode)
          // }
          newChild[newStartIndex]._hostNode = newDomNode
        }
      }
    } else if (newStartIndex > newEndIndex) {
      for (; oldStartIndex - 1 < oldEndIndex; oldStartIndex++) {
        if (oldChild[oldStartIndex]) {
          let removeNode = oldChild[oldStartIndex]
          if (typeNumber(removeNode._hostNode) <= 1) {
            //证明这个节点已经被移除；
            continue
          }
          disposeVnode(removeNode)
        }
      }
    }
  }
  return newChild
}

/**
 * 当我们更新组件的时候，并不需要重新创建一个组件，而是拿到久的组件的props,state,context就可以进行重新render
 * 而且要注意的是，组件的更新并不需要比对或者交换state,因为组件的更新完全依靠外部的context和props
 * @param {*} oldComponentVnode 老的孩子组件，_instance里面有着这个组件的实例
 * @param {*} newComponentVnode 新的组件
 * @param {*} parentContext 父亲context
 * @param {*} parentDomNode 父亲节点
 */
function updateComponent(oldComponentVnode, newComponentVnode, parentContext, parentDomNode) {
  const { oldState, oldProps, oldContext, oldVnode } = instanceProps(oldComponentVnode)

  const newProps = newComponentVnode.props
  let newContext = parentContext
  const instance = oldComponentVnode._instance
  // const willReceive = oldContext !== newContext || oldProps !== newProps
  //如果props和context中的任意一个改变了，那么就会触发组件的receive,render,update等
  //但是依旧会继续往下比较

  //更新原来组件的信息
  oldComponentVnode._instance.props = newProps

  if (instance.getChildContext) {
    oldComponentVnode._instance.context = extend(extend({}, newContext), instance.getChildContext())
  } else {
    oldComponentVnode._instance.context = extend({}, newContext)
  }

  oldComponentVnode._instance.lifeCycle = Com.UPDATING
  if (oldComponentVnode._instance.componentWillReceiveProps) {
    catchError(oldComponentVnode._instance, 'componentWillReceiveProps', [newProps, newContext])
    let mergedState = oldComponentVnode._instance.state
    oldComponentVnode._instance._penddingState.forEach(partialState => {
      mergedState = extend(extend({}, mergedState), partialState.partialNewState)
    })
    oldComponentVnode._instance.state = mergedState
  }

  if (oldComponentVnode._instance.shouldComponentUpdate) {
    let shouldUpdate = catchError(oldComponentVnode._instance, 'shouldComponentUpdate', [
      newProps,
      oldState,
      newContext
    ])
    if (!shouldUpdate) {
      //无论shouldComponentUpdate结果是如何，数据都会给用户设置上去
      //但是不一定会刷新
      oldComponentVnode._instance.props = newProps
      oldComponentVnode._instance.context = newContext
      return
    }
  }

  if (oldComponentVnode._instance.componentWillUpdate) {
    catchError(oldComponentVnode._instance, 'componentWillUpdate', [newProps, oldState, newContext])
  }

  let lastOwner = currentOwner.cur
  currentOwner.cur = oldComponentVnode._instance

  let newVnode = oldComponentVnode._instance.render
    ? catchError(oldComponentVnode._instance, 'render', [])
    : new newComponentVnode.type(newProps, newContext)
  newVnode = newVnode ? newVnode : new VnodeClass('#text', '', null, null) //用户有可能返回null，当返回null的时候使用一个空白dom代替
  const renderedType = typeNumber(newVnode)
  if (renderedType === 3 && renderedType === 4) {
    renderedVnode = new VnodeClass('#text', renderedVnode, null, null)
  }
  let fixedOldVnode = oldVnode ? oldVnode : oldComponentVnode._instance

  currentOwner.cur = lastOwner

  const willUpdate = options.dirtyComponent[oldComponentVnode._instance._uniqueId] //因为用react-redux更新的时候，不然会重复更新.
  if (willUpdate) {
    //如果这个component正好是需要更新的component，那么则更新，然后就将他从map中删除
    //不然会重复更新
    delete options.dirtyComponent[oldComponentVnode._instance._uniqueId]
  }

  //更新真实dom,保存新的节点

  update(fixedOldVnode, newVnode, oldComponentVnode._hostNode, instance.context)
  oldComponentVnode._hostNode = newVnode._hostNode
  if (oldComponentVnode._instance.Vnode) {
    //更新React component的时候需要用新的完全更新旧的component，不然无法更新
    oldComponentVnode._instance.Vnode = newVnode
  } else {
    oldComponentVnode._instance = newVnode
  }

  if (oldComponentVnode._instance) {
    if (oldComponentVnode._instance.componentDidUpdate) {
      catchError(oldComponentVnode._instance, 'componentDidUpdate', [oldProps, oldState, oldContext])
    }
    oldComponentVnode._instance.lifeCycle = Com.UPDATED
  }
}

export function update(oldVnode, newVnode, parentDomNode, parentContext) {
  newVnode._hostNode = oldVnode._hostNode
  if (oldVnode.type === newVnode.type) {
    if (typeNumber(oldVnode) === 7) {
      newVnode = updateChild(oldVnode, newVnode, parentDomNode, parentContext)

      newVnode.return = oldVnode.return
      newVnode._hostNode = newVnode[0]._hostNode
    }

    if (oldVnode.type === '#text') {
      newVnode._hostNode = oldVnode._hostNode //更新一个dom节点
      updateText(oldVnode, newVnode)

      return newVnode
    }
    if (typeof oldVnode.type === 'string') {
      //原生html
      updateProps(oldVnode.props, newVnode.props, newVnode._hostNode)
      if (oldVnode.ref !== newVnode.ref) {
        // if (typeNumber(oldVnode.ref) === 5) {
        //     oldVnode.ref(null)
        // }
        setRef(newVnode, oldVnode.owner, newVnode._hostNode)
      }

      //更新后的child，返回给组件
      newVnode.props.children = updateChild(
        oldVnode.props.children,
        newVnode.props.children,
        oldVnode._hostNode,
        parentContext
      )
    }
    if (typeof oldVnode.type === 'function') {
      //非原生
      if (!oldVnode._instance.render) {
        const { props } = newVnode
        const newStateLessInstance = new newVnode.type(props, parentContext)
        update(oldVnode._instance, newStateLessInstance, parentDomNode, parentContext)
        newStateLessInstance.owner = oldVnode._instance.owner
        newStateLessInstance.ref = oldVnode._instance.ref
        newStateLessInstance.key = oldVnode._instance.key
        newVnode._instance = newStateLessInstance
        return newVnode
      }

      updateComponent(oldVnode, newVnode, parentContext, parentDomNode)
      newVnode.owner = oldVnode.owner
      newVnode.ref = oldVnode.ref
      newVnode.key = oldVnode.key
      newVnode._instance = oldVnode._instance
      newVnode._PortalHostNode = oldVnode._PortalHostNode ? oldVnode._PortalHostNode : void 666
    }
  } else {
    if (typeNumber(newVnode) === 7) {
      newVnode.forEach((newvnode, index) => {
        let dom = renderByLuy(newvnode, parentDomNode, true, parentContext)
        if (index === 0) newVnode._hostNode = dom
        const parentNode = parentDomNode.parentNode
        if (newvnode._hostNode) {
          parentNode.insertBefore(dom, oldVnode._hostNode)
        } else {
          parentNode.appendChild(dom)
          newvnode._hostNode = dom
        }
      })
      disposeVnode(oldVnode)
      return newVnode
    }
    const dom = renderByLuy(newVnode, parentDomNode, true, parentContext)
    if (typeNumber(newVnode.type) !== 5) {
      // disposeVnode(oldVnode);
      newVnode._hostNode = dom

      // const parentNode = parentDomNode.parentNode
      if (oldVnode._hostNode) {
        parentDomNode.insertBefore(dom, oldVnode._hostNode)
        disposeVnode(oldVnode)
      } else {
        parentDomNode.appendChild(dom)
      }
    }
  }
  return newVnode
}

/**
 * 递归渲染虚拟组件
 * @param {*} Vnode
 * @param {Element} parentDomNode
 */
function mountComponent(Vnode, parentDomNode, parentContext) {
  const { type, props, key, ref } = Vnode

  const Component = type
  let instance = new Component(props, parentContext)
  Vnode._instance = instance // 在父节点上的child元素会保存一个自己

  if (!instance.render) {
    Vnode._instance = instance //for react-redux,这里是渲染无状态组件
    return renderByLuy(instance, parentDomNode, false, parentContext)
  }

  if (instance.getChildContext) {
    //如果用户定义getChildContext，那么用它生成子context
    instance.context = extend(extend({}, instance.context), instance.getChildContext())
  } else {
    instance.context = extend({}, parentContext)
  }

  //生命周期函数
  if (instance.componentWillMount) {
    const isCatched = catchError(instance, 'componentWillMount', [Vnode])
    if (isCatched) return
  }

  let lastOwner = currentOwner.cur
  currentOwner.cur = instance
  let renderedVnode = catchError(instance, 'render', [Vnode])
  const renderedType = typeNumber(renderedVnode)
  if (renderedType === 7) {
    renderedVnode = mountChild(renderedVnode, parentDomNode, parentContext, instance, Vnode)
  }
  if (renderedType === 3 && renderedType === 4) {
    renderedVnode = new VnodeClass('#text', renderedVnode, null, null)
  }
  currentOwner.cur = lastOwner

  if (renderedVnode === void 233) {
    // console.warn('你可能忘记在组件render()方法中返回jsx了');
    return
  }
  renderedVnode = renderedVnode ? renderedVnode : new VnodeClass('#text', '', null, null)

  renderedVnode.key = key || null
  instance.Vnode = renderedVnode
  instance.Vnode._mountIndex = mountIndexAdd()

  Vnode.displayName = Component.name //以下这两行用于componentDidcatch
  instance.Vnode.return = Vnode //必须要在插入前设置return(父Vnode)给所有的Vnode.

  var domNode = null
  if (renderedType !== 7) {
    domNode = renderByLuy(renderedVnode, parentDomNode, false, instance.context, instance)
    // renderedVnode.displayName = Component.name;//记录名字
  } else {
    domNode = renderedVnode[0]._hostNode
  }

  setRef(Vnode, instance, domNode)

  Vnode._hostNode = domNode
  instance.Vnode._hostNode = domNode //用于在更新时期oldVnode的时候获取_hostNode

  if (renderedVnode._PortalHostNode) {
    //支持react createPortal
    Vnode._PortalHostNode = renderedVnode._PortalHostNode
    renderedVnode._PortalHostNode._PortalHostNode = domNode
  }

  if (instance.componentDidMount) {
    //Moutting变量用于标记组件是否正在挂载
    //如果正在挂载，则所有的setState全部都要合并
    instance.lifeCycle = Com.MOUNTTING
    catchError(instance, 'componentDidMount', [])
    instance.componentDidMount = null //防止用户调用
    instance.lifeCycle = Com.MOUNT
  }

  if (instance.componentDidCatch) {
    // runException();
    // instance.componentDidCatch();
  }

  instance._updateInLifeCycle() // componentDidMount之后一次性更新
  return domNode
}

function mountNativeElement(Vnode, parentDomNode, instance) {
  const domNode = renderByLuy(Vnode, parentDomNode, false, {}, instance)
  Vnode._hostNode = domNode
  Vnode._mountIndex = mountIndexAdd()
  return domNode
}
function mountTextComponent(Vnode, domNode) {
  let fixText = Vnode.props === 'createPortal' ? '' : Vnode.props
  let textDomNode = document.createTextNode(fixText)
  domNode.appendChild(textDomNode)
  Vnode._hostNode = textDomNode
  Vnode._mountIndex = mountIndexAdd()
  return textDomNode
}

function mountChild(childrenVnode, parentDomNode, parentContext, instance, parentVnode) {
  let childType = typeNumber(childrenVnode)
  let flattenChildList = childrenVnode

  if (childrenVnode === undefined) {
    flattenChildList = flattenChildren(childrenVnode, parentVnode)
  }

  if (childType === 8 && childrenVnode !== undefined) {
    //Vnode
    flattenChildList = flattenChildren(childrenVnode, parentVnode)
    if (typeNumber(childrenVnode.type) === 5) {
      flattenChildList._hostNode = renderByLuy(flattenChildList, parentDomNode, false, parentContext, instance)
    } else if (typeNumber(childrenVnode.type) === 3 || typeNumber(childrenVnode.type) === 4) {
      flattenChildList._hostNode = mountNativeElement(flattenChildList, parentDomNode, instance)
    }
  }
  if (childType === 7) {
    //list
    flattenChildList = flattenChildren(childrenVnode, parentVnode)
    flattenChildList.forEach(item => {
      if (item) {
        if (typeof item.type === 'function') {
          //如果是组件先不渲染子嗣
          mountComponent(item, parentDomNode, parentContext)
        } else {
          renderByLuy(item, parentDomNode, false, parentContext, instance)
        }
      }
    })
  }
  if (childType === 4 || childType === 3) {
    //string or number
    flattenChildList = flattenChildren(childrenVnode, parentVnode)
    mountTextComponent(flattenChildList, parentDomNode)
  }
  return flattenChildList
}

export function findDOMNode(ref) {
  if (ref == null) {
    return null
  }
  if (ref.nodeType === 1) {
    return ref
  }
  return ref.__dom || null
}

/**
 * ReactDOM.render()函数入口
 * 渲染组件，组件的子组件，都在这里
 * @param {*} Vnode
 * @param {Element} container
 * @param {boolean} isUpdate
 * @param {boolean} instance 用于实现refs机制
 */
let depth = 0
function renderByLuy(Vnode, container, isUpdate, parentContext, instance) {
  const { type, props } = Vnode

  if (!type) return
  const { children } = props
  let domNode
  if (typeof type === 'function') {
    const fixContext = parentContext || {}
    domNode = mountComponent(Vnode, container, fixContext)
  } else if (typeof type === 'string' && type === '#text') {
    domNode = mountTextComponent(Vnode, container)
  } else {
    domNode = document.createElement(type)
  }

  if (typeof type !== 'function') {
    //当Vnode是一个虚拟组件的时候，则不要渲染他的子组件，而是等到创建他了以后，再根据他的render函数来渲染
    if (typeNumber(children) > 2 && children !== undefined) {
      const NewChild = mountChild(children, domNode, parentContext, instance, Vnode) //flatten之后的child 要保存下来
      props.children = NewChild
    }
  }
  Vnode._hostNode = domNode //缓存真实节点

  if (typeNumber(domNode) === 7) {
    if (isUpdate) {
      return domNode
    } else {
      if (container && domNode && container.nodeName !== '#text') {
        domNode.forEach(DOM_SINGLE_Node => {
          container.appendChild(DOM_SINGLE_Node)
        })
      }
    }
  }

  setRef(Vnode, instance, domNode) //为虚拟组件添加ref
  mapProp(domNode, props, Vnode) //为元素添加props

  if (isUpdate) {
    return domNode
  } else {
    Vnode._mountIndex = mountIndexAdd()
    if (container && domNode && container.nodeName !== '#text') {
      container.appendChild(domNode)
    }
  }
  return domNode
}

/**
 *
 * @param {Vnode} Vnode Vnode是一颗虚拟DOM树，他的生成方式是babel-transform-react-jsx调用createElement进行的。
 * @param {Element} container 这是一个真实DOM节点，用于插入虚拟DOM。
 */
export function render(Vnode, container) {
  console.log(Vnode)

  if (typeNumber(container) !== 8) {
    throw new Error('Target container is not a DOM element.')
  }

  const UniqueKey = container.UniqueKey
  if (container.UniqueKey) {
    //已经被渲染
    const oldVnode = containerMap[UniqueKey]
    const rootVnode = update(oldVnode, Vnode, container)
    runException()
    return Vnode._instance
  } else {
    //第一次渲染的时候
    Vnode.isTop = true
    container.UniqueKey = mountIndexAdd()
    containerMap[container.UniqueKey] = Vnode
    renderByLuy(Vnode, container, false, Vnode.context, Vnode.owner)
    runException()
    return Vnode._instance
  }
}
