import { createInstance } from './core/createInstance'
import { createWorkInProgress } from './createWorkInProgress'
import { tag } from './core/tags'
import { Renderer, Effect } from './renderer'
import { performUnitOfWork } from './render/beginWork'

const EXPIRATION_TIME = 1 // ms async 逾期时间

export function render(Vnode, Container, callback) {
  Renderer.updateQueue.push({
    fromTag: tag.HOST_ROOT,
    stateNode: Container,
    props: { children: Vnode }
  })

  requestIdleCallback(performWork) //开始干活
}

export function scheduleWork(instance, partialState) {
  Renderer.updateQueue.push({
    fromTag: tag.CLASS_COMPONENT,
    stateNode: instance,
    partialState: partialState
  })
  requestIdleCallback(performWork) //开始干活
}

function performWork(deadline) {
  workLoop(deadline)
  if (Renderer.nextUnitOfWork || Renderer.updateQueue.length > 0) {
    requestIdleCallback(performWork) //继续干
  }
}

function workLoop(deadline) {
  if (!Renderer.nextUnitOfWork) {
    //一个周期内只创建一次
    Renderer.nextUnitOfWork = createWorkInProgress(Renderer.updateQueue)
  }

  while (Renderer.nextUnitOfWork && deadline.timeRemaining() > EXPIRATION_TIME) {
    Renderer.nextUnitOfWork = performUnitOfWork(Renderer.nextUnitOfWork)
  }

  if (Renderer.pendingCommit) {
    //当全局 Renderer.pendingCommit 变量被负值
    commitAllwork(Renderer.pendingCommit)
  }
}

function commitAllwork(topFiber) {
  topFiber.effects.forEach(f => {
    commitWork(f)
  })

  topFiber.stateNode._rootContainerFiber = topFiber
  topFiber.effects = []
  Renderer.nextUnitOfWork = null
  Renderer.pendingCommit = null
}

function commitWork(effectFiber) {
  if (effectFiber.tag === tag.HOST_ROOT) {
    // 代表 root 节点没什么必要操作
    return
  }

  // 拿到parent的原因是，我们要将元素插入的点，插在父亲的下面
  let domParentFiber = effectFiber.return
  while (domParentFiber.tag === tag.CLASS_COMPONENT || domParentFiber.tag === tag.FunctionalComponent) {
    // 如果是 class 就直接跳过，因为 class 类型的fiber.stateNode 是其本身实例
    domParentFiber = domParentFiber.return
  }

  //拿到父亲的真实 DOM
  const domParent = domParentFiber.stateNode
  if (effectFiber.effectTag === Effect.PLACEMENT) {
    if (effectFiber.tag === tag.HOST_COMPONENT || effectFiber.tag === tag.HostText) {
      //通过 tag 检查是不是真实的节点
      domParent.appendChild(effectFiber.stateNode)
    }
  } else if (effectFiber.effectTag == Effect.UPDATE) {
    updateDomProperties(effectFiber.stateNode, effectFiber.alternate.props, effectFiber.props)
  } else if (effectFiber.effectTag == Effect.DELETION) {
    commitDeletion(effectFiber, domParent)
  }
}

function updateDomProperties(dom, prevProps, nextProps) {
  // console.log(dom, prevProps, nextProps)
}

function updateHostComponent(currentFiber) {
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

function cloneChildFiber(parentFiber) {
  const oldFiber = parentFiber.alternate
  if (!oldFiber.child) {
    return
  }
  let oldChild = oldFiber.child
  let prevChild = null
  let index = 0
  let next = void 666
  while (oldChild) {
    const newChild = {
      type: oldChild.type,
      tag: oldChild.tag,
      stateNode: oldChild.stateNode,
      props: oldChild.props,
      partialState: oldChild.partialState,
      alternate: oldChild,
      return: parentFiber
    }
    if (prevChild) {
      prevChild.sibling = newChild
    } else {
      parentFiber.child = newChild
    }
    prevChild = newChild
    oldChild = oldChild.sibling

    if (index === 0) {
      next = newChild
    }
    index++
  }
  return next
}

function commitDeletion(fiber, domParent) {
  let node = fiber
  while (true) {
    if (node.tag == tag.CLASS_COMPONENT) {
      node = node.child
      continue
    }
    domParent.removeChild(node.stateNode)
    while (node != fiber && !node.sibling) {
      node = node.return
    }
    if (node == fiber) {
      return
    }
    node = node.sibling
  }
}
