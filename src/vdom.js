var next = void 666
var renderStack = []
/**
 *
 * @param {*} Vnode
 * @param {*} Container
 * @param {*} callback
 */
export function render(Vnode, Container, callback) {
  beginRender(Vnode, Container)
}

function beginRender(Vnode, Container) {
  next = Vnode
  let VnodeType = next.VnodeType
  while (next) {
    renderStack.push(next)

    if (VnodeType === 5) {
      // component
      next = renderComponent(next)
    }
    if (VnodeType === 4 || VnodeType === 3) {
      next = renderNativeElement(next)
    }
    if (next) {
      VnodeType = next.VnodeType
    }
  }

  console.log(renderStack)
}

function renderComponent(VnodeComponent) {
  const component = VnodeComponent.type
  const componentProps = VnodeComponent.props
  const instance = new component(componentProps)
  const nextChildren = instance.render()
  return nextChildren
}

function renderNativeElement(VnodeNativeElement) {
  return VnodeNativeElement.props.children
}

function reconcilerChildren() {}
