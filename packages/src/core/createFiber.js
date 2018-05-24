export function createFiber(tag, type, props, Return, effectTag) {
  return {
    type: type,
    tag: tag,
    props: props,
    return: Return,
    effectTag: effectTag
  }
}
