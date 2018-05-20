const ReactDOM = require('../src/vdom')
const { Component } = require('../src/component')
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
  it('setState will work', done => {
    class App extends Component {
      state = {
        info: true
      }
      constructor(props) {
        super(props)
        setTimeout(() => {
          this.setState({
            info: !this.state.info
          })
        }, 5)
      }
      render() {
        return (
          <div>
            <div>{this.state.info ? 'imasync' : 'iminfo'}</div>
          </div>
        )
      }
    }
    ReactDOM.render(<App />, container)
    check(() => {
      expect(container.innerHTML).toEqual('<div><div>iminfo</div></div>')
      done()
    })
  })
})
