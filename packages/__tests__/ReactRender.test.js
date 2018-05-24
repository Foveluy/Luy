const ReactDOM = require('../src/vdom')
const { Component } = require('../src/core/component')
const React = require('../src/Luy/index')
const { check } = require('../testUtils')

describe('ReactRenderDOM', () => {
  let container
  beforeEach(() => {
    container = document.createElement('div')
  })
  afterEach(() => {
    // ReactDOM.unmountComponentAtNode(container)
  })
  it('should normal render', done => {
    class App extends Component {
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
    class Numberic extends Component {
      render() {
        return 1
      }
    }
    ReactDOM.render(<Numberic />, container)

    check(() => {
      expect(container.innerHTML).toEqual('1')
      done()
    })
  })

  it('should render number in inside nested element', done => {
    class App extends Component {
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

  it('should render list child component', done => {
    class App extends Component {
      render() {
        return (
          <div>
            <span>4</span>
            <p>3</p>
            <span>2</span>
            <p>1</p>
          </div>
        )
      }
    }
    ReactDOM.render(<App />, container)

    check(() => {
      expect(container.innerHTML).toEqual('<div><span>4</span><p>3</p><span>2</span><p>1</p></div>')
      done()
    })
  })

  it('should render stateless component', done => {
    const App = () => {
      return <div>stateless</div>
    }
    ReactDOM.render(<App />, container)

    check(() => {
      expect(container.innerHTML).toEqual('<div>stateless</div>')
      done()
    })
  })

  it('should render array children', done => {
    const App = () => {
      return [<span />, <span />, <span />, <span />]
    }
    ReactDOM.render(<App />, container)

    check(() => {
      expect(container.innerHTML).toEqual('<span></span><span></span><span></span><span></span>')
      done()
    })
  })

  it('should render children', done => {
    class App extends Component {
      render() {
        return <div>{this.props.children}</div>
      }
    }
    ReactDOM.render(<App>hello children</App>, container)

    check(() => {
      expect(container.innerHTML).toEqual('<div>hello children</div>')
      done()
    })
  })
})
