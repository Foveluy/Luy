import { createInstance } from './createInstance'
import { createWorkInProgress } from './createWorkInProgress'
import { tag } from './tags'

const updateQueue = []
let nextUnitOfWork = null
let pendingCommit = null
let isAsync = true // 开启异步渲染的开关

const EXPIRATION_TIME = 1 // ms async 逾期时间

export function render(Vnode, Container, callback) {
  updateQueue.push({
    fromTag: tag.HOST_ROOT,
    stateNode: Container,
    props: { children: Vnode }
  })

  requestIdleCallback(performWork) //开始干活
}

function performWork(deadline) {
  workLoop(deadline)

  if (nextUnitOfWork || updateQueue.length > 0) {
    requestIdleCallback(performWork) //继续干
  }
}

function workLoop(deadline) {
  if (!nextUnitOfWork) {
    //一个周期内只创建一次
    nextUnitOfWork = createWorkInProgress(updateQueue)
  }

  while (nextUnitOfWork && deadline.timeRemaining() > EXPIRATION_TIME) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }

  if (pendingCommit) {
    //当全局 pendingCommit 变量被负值
    commitAllwork(pendingCommit)
  }
}

function commitAllwork(topFiber) {
  topFiber.effects.forEach(f => {
    commitWork(f)
  })

  topFiber.stateNode._rootContainerFiber = topFiber
  nextUnitOfWork = null
  pendingCommit = null
}

function commitWork(effectFiber) {
  if (effectFiber.tag === tag.HOST_ROOT) {
    // 代表 root 节点没什么必要操作
    return
  }

  // 拿到parent的原因是，我们要将元素插入的点，插在父亲的下面
  let domParentFiber = effectFiber.return
  while (domParentFiber.tag === tag.CLASS_COMPONENT) {
    // 如果是 class 就直接跳过，因为 class 类型的fiber.stateNode 是其本身实例
    domParentFiber = domParentFiber.return
  }
  const domParent = domParentFiber.stateNode
  if (effectFiber.effectTag === PLACEMENT && effectFiber.tag === tag.HOST_COMPONENT) {
    domParent.appendChild(effectFiber.stateNode)
  }
}

// 开始遍历
function performUnitOfWork(workInProgress) {
  const nextChild = beginWork(workInProgress)
  if (nextChild) return nextChild

  // 没有 nextChild, 我们看看这个节点有没有 sibling
  let current = workInProgress
  while (current) {
    //收集当前节点的effect，然后向上传递
    completeWork(current)
    if (current.sibling) return current.sibling
    //没有 sibling，回到这个节点的父亲，看看有没有sibling
    current = current.return
  }
}

function beginWork(currentFiber) {
  switch (currentFiber.tag) {
    case tag.CLASS_COMPONENT: {
      return updateClassComponent(currentFiber)
    }
    default: {
      return updateHostComponent(currentFiber)
    }
  }
}

function completeWork(currentFiber) {
  if (currentFiber.tag === tag.CLASS_COMPONENT) {
    // 不懂干嘛的
    currentFiber.stateNode.__fiber = currentFiber
  }

  if (currentFiber.return) {
    const currentEffect = currentFiber.effects || [] //收集当前节点的 effect list
    const currentEffectTag = currentFiber.effectTag ? [currentFiber] : []
    const parentEffects = currentFiber.return.effects || []
    currentFiber.return.effects = parentEffects.concat(currentEffect, currentEffectTag)
  } else {
    // 到达最顶端了
    pendingCommit = currentFiber
  }
}

function updateHostComponent(currentFiber) {
  // 当一个 fiber 对应的 stateNode 是原生节点，那么他的 children 就放在 props 里
  if (!currentFiber.stateNode) {
    currentFiber.stateNode = document.createElement(currentFiber.type)
  }
  const newChildren = currentFiber.props.children
  return reconcileChildrenArray(currentFiber, newChildren)
}

function updateClassComponent(currentFiber) {
  let instance = currentFiber.stateNode
  if (!instance) {
    // 如果是 mount 阶段，构建一个 instance
    instance = currentFiber.stateNode = createInstance(currentFiber)
  } else if (currentFiber.props === instance.props || !currentFiber.partialState) {
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

function arrayfiy(val) {
  return val === null ? [] : Array.isArray(val) ? val : [val]
}

// Effect tags
const PLACEMENT = 1
const DELETION = 2
const UPDATE = 3

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
        props: oldFiber.props,
        return: currentFiber,
        alternate: oldFiber,
        partialState: oldFiber.partialState,
        effectTag: UPDATE
      }
    }

    if (!isSameFiber && newChild) {
      newFiber = {
        type: newChild.type,
        tag: typeof newChild.type === 'string' ? tag.HOST_COMPONENT : tag.CLASS_COMPONENT, //todo: number
        props: newChild.props,
        return: currentFiber,
        effectTag: PLACEMENT
      }
    }

    if (!isSameFiber && oldFiber) {
      // 这个情况的意思是新的节点比旧的节点少
      // 这时候，我们要将变更的 effect 放在本节点的 list 里
      oldFiber.effectTag = DELETION
      currentFiber.effects = currentFiber.effects || []
      currentFiber.effects.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
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
