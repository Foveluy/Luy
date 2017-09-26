import React from './Luy'
import ReactDOM from './Luy'
import Component from './Luy'

let a = [1, 2, 3, 4, 5]

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      counter: 1
    }
    setTimeout(() => {
      this.setState({ counter: this.state.counter + 2 })
    }, 500);
  }
  render() {
    return (
      <div style={{height:`${10 * this.state.counter}px`,border:'1px solid black',transition:'all 0.2s'}}>
        asdasdasd
      </div>
    )
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);