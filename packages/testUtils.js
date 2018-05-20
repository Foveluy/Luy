exports.check = function check(fn) {
  jest.useFakeTimers()
  setTimeout(() => {
    fn()
  }, 10)

  jest.runAllTimers()
}
