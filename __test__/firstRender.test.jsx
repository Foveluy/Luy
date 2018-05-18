import React from '../src/Luy/index'
import { render } from '../src/vdom'





class App extends React.Component {
  render() {
    console.log('render')
    return (
      <div>
        <span />
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
