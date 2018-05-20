export function createInstance(fiber) {
  const instance = new fiber.type(fiber.props)
  instance._internalfiber = fiber
  return instance
}
