import React from './Luy/index'
import { render } from './vdom'

class App extends React.Component {
  render() {
    return (
      <div>
        <span />
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
