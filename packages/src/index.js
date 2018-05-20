import React from './Luy/index'
import { Component } from './component'
import { render } from './vdom'

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
    }, 1000)
  }

  render() {
    return (
      <div>
        <span>hello</span>
        <span>luy</span>
        <div>{this.state.info ? 'imasync' : 'iminfo'}</div>
      </div>
    )
  }
}
render(<App />, document.getElementById('root'))
