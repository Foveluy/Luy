/**
 * 渲染器
 */
class _Renderer {
  constructor() {
    this.updateQueue = []
    this.nextUnitOfWork = null
    this.pendingCommit = null
    this.isAsync = true // 开启异步渲染的开关
  }
}

/**
 * effect tag
 */
export const Effect = {
  PLACEMENT: 1,
  DELETION: 2,
  UPDATE: 3
}

export const Renderer = new _Renderer()
