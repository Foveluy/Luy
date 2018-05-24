import { tag } from '../core/tags'
import { Effect } from '../renderer'
import { createInstance } from '../core/createInstance'
import { createFiber } from '../core/createFiber'

export function updateHostComponent(currentFiber) {
  // 当一个 fiber 对应的 stateNode 是原生节点，那么他的 children 就放在 props 里
  if (!currentFiber.stateNode) {
    if (currentFiber.type === null) {
      //代表这是文字节点
      currentFiber.stateNode = document.createTextNode(currentFiber.props)
    } else {
      //代表这是真实原生 DOM 节点
      currentFiber.stateNode = document.createElement(currentFiber.type)
    }
  }
  const newChildren = currentFiber.props.children
  return reconcileChildrenArray(currentFiber, newChildren)
}

function arrayfiy(val) {
  return val === null ? [] : Array.isArray(val) ? val : [val]
}

function reconcileChildrenArray(currentFiber, newChildren) {
  // 对比节点，相同的标记更新
  // 不同的标记 替换
  // 多余的标记删除，并且记录下来
  const arrayfiyChildren = arrayfiy(newChildren)

  let index = 0
  let oldFiber = currentFiber.alternate ? currentFiber.alternate.child : null
  let newFiber = null

  while (index < arrayfiyChildren.length || oldFiber !== null) {
    const prevFiber = newFiber
    const newChild = arrayfiyChildren[index]
    const isSameFiber = oldFiber && newChild && newChild.type === oldFiber.type

    if (isSameFiber) {
      newFiber = {
        type: oldFiber.type,
        tag: oldFiber.tag,
        stateNode: oldFiber.stateNode,
        props: newChild.props,
        return: currentFiber,
        alternate: oldFiber,
        partialState: oldFiber.partialState,
        effectTag: Effect.UPDATE
      }
    }

    if (!isSameFiber && newChild) {
      newFiber = placeChild(currentFiber, newChild)
    }

    if (!isSameFiber && oldFiber) {
      // 这个情况的意思是新的节点比旧的节点少
      // 这时候，我们要将变更的 effect 放在本节点的 list 里
      oldFiber.effectTag = Effect.DELETION
      currentFiber.effects = currentFiber.effects || []
      currentFiber.effects.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling || null
    }

    if (index === 0) {
      currentFiber.child = newFiber
    } else if (prevFiber && newChild) {
      // 这里不懂是干嘛的
      prevFiber.sibling = newFiber
    }

    index++
  }
  return currentFiber.child
}

export function updateFunctionalComponent(currentFiber) {
  let type = currentFiber.type
  let props = currentFiber.props
  const newChildren = currentFiber.type(props)

  return reconcileChildrenArray(currentFiber, newChildren)
}

export function updateClassComponent(currentFiber) {
  let instance = currentFiber.stateNode
  if (!instance) {
    // 如果是 mount 阶段，构建一个 instance
    instance = currentFiber.stateNode = createInstance(currentFiber)
  } else if (currentFiber.props === instance.props && !currentFiber.partialState) {
    // 如果是 update 阶段,对比发现 props 和 state 没变
    return cloneChildFiber(currentFiber)
  }

  // 将新的state,props刷给当前的instance
  instance.props = currentFiber.props
  instance.state = { ...instance.state, ...currentFiber.partialState }

  // 清空 partialState
  currentFiber.partialState = null
  const newChildren = currentFiber.stateNode.render()

  // currentFiber 代表老的，newChildren代表新的
  // 这个函数会返回孩子队列的第一个
  return reconcileChildrenArray(currentFiber, newChildren)
}

function placeChild(currentFiber, newChild) {
  const type = newChild.type

  if (typeof newChild === 'string' || typeof newChild === 'number') {
    // 如果这个节点没有 type ,这个节点就可能是 number 或者 string
    return createFiber(tag.HostText, null, newChild, currentFiber, Effect.PLACEMENT)
  }

  if (typeof type === 'string') {
    // 原生节点
    return createFiber(tag.HOST_COMPONENT, newChild.type, newChild.props, currentFiber, Effect.PLACEMENT)
  }

  if (typeof type === 'function') {
    // 可能有两种
    const _tag = type.prototype.isReactComponent ? tag.CLASS_COMPONENT : tag.FunctionalComponent

    return {
      type: newChild.type,
      tag: _tag,
      props: newChild.props,
      return: currentFiber,
      effectTag: Effect.PLACEMENT
    }
  }
}
