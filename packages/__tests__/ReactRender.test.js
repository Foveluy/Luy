const ReactDOM = require('../src/vdom')
const React = require('../src/Luy/index')

function check(fn) {
  jest.useFakeTimers()
  setTimeout(() => {
    fn()
  }, 10)

  jest.runAllTimers()
}

describe('ReactRenderDOM', () => {
  let container
  beforeEach(() => {
    container = document.createElement('div')
  })
  afterEach(() => {
    // ReactDOM.unmountComponentAtNode(container)
  })
  it('should normal render', done => {
    class App extends React.Component {
      render() {
        return (
          <div>
            <span />
          </div>
        )
      }
    }
    ReactDOM.render(<App />, container)

    check(() => {
      expect(container.innerHTML).toEqual('<div><span></span></div>')
      done()
    })
  })

  it('should render number or text in React.Component', done => {
    class App extends React.Component {
      render() {
        return 1
      }
    }
    ReactDOM.render(<App />, container)

    check(() => {
      expect(container.innerHTML).toEqual('1')
      done()
    })
  })

  it('should render number in inside nested element', done => {
    class App extends React.Component {
      render() {
        return <div>123</div>
      }
    }
    ReactDOM.render(<App />, container)

    check(() => {
      expect(container.innerHTML).toEqual('<div>123</div>')
      done()
    })
  })
})
