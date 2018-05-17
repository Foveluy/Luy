const HOST_COMPONENT = 'host'
const CLASS_COMPONENT = 'class'
const HOST_ROOT = 'root'

const updateQueue = []
let nextUnitOfWork = null
let pendingCommit = null
let isAsync = true // 开启异步渲染的开关

const ENOUGH_TIME = 1 // ms async 逾期时间

/**
 * 为了将首次渲染和更新统一起来，设计了一个 updateQueue
 * @param {*} Vnode
 * @param {*} Container
 */
export function render(Vnode, Container) {
  updateQueue.push({
    from: HOST_ROOT,
    dom: Container,
    newProps: { children: Vnode }
  })
  if (isAsync) {
    requestIdleCallback(performWork)
  }
}

function performWork(deadline) {
  workLoop(deadline)
  if (nextUnitOfWork || updateQueue.length > 0) {
    //意思是如果更新队列还有任务
    requestIdleCallback(performWork)
  }
}

function workLoop(deadline) {
  if (!nextUnitOfWork) {
    //第一步，如果 nextUnitOfWork 全局变量没有数据
    //则请求数据
    resetNextUnitOfWork()
  }
  while (nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME) {
    //第二步
    //如果 nextUnitOfWork 全局变量依旧有数据 && deadline.timeRemaining() 每一帧仍然有时间
    //则把 working progress tree 中的每一个树节点拿出来循环
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }

  // if (pendingCommit) {
  //第三步，一次性把树中所有创建的 DOM 全部 commit 到我们的 DOM 中，一保证 UI 的连续性
  //   commitAllWork(pendingCommit)
  // }
}

/**
 * 设置全局变量，如果没有了，就退出
 */
function resetNextUnitOfWork() {
  const update = updateQueue.shift()
  if (!update) {
    return
  }

  // 如果是第一次渲染，root 就是没东西的
  // 如果是之后的，则会有
  const root = update.from === HOST_ROOT ? update.dom._rootContainerFiber : getRoot(update.instance.__fiber)

  // 这个就是我们 root working-progress-tree
  nextUnitOfWork = {
    tag: HOST_ROOT, // 标记为 working-progress-tree 的 root 节点
    stateNode: update.dom || root.stateNode, // 首次更新来自 contrainer，其他是当前节点
    props: update.newProps || root.props, // 首次更新来自顶层 root，其他是当前节点
    alternate: root
  }
}


function performUnitOfWork(workInProgress){
  
}