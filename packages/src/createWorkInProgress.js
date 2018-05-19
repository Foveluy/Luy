import { tag } from './tags'

// {
//   from: HOST_ROOT,
//   stateNode: Container,
//   props: { children: Vnode }
// }

export function createWorkInProgress(updateQueue) {
  const updateTask = updateQueue.shift()
  if (!updateTask) return

  const rootFiber =
    updateTask.fromTag === tag.HOST_ROOT
      ? updateTask.stateNode._rootContainerFiber
      : getRoot(updateTask.stateNode._internalfiber)

  return {
    tag: updateTask.fromTag,
    stateNode: updateTask.stateNode,
    props: updateTask.props || root.props,
    alternate: rootFiber // 用于保存现有的tree
  }
}

function getRoot(fiber) {
  let _fiber = fiber
  while (_fiber.return) {
    _fiber = _fiber.return
  }
  return _fiber
}
