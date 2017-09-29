import React from './Luy'
import ReactDOM from './Luy'
import Component from './Luy'

let a = [1, 2, 3, 4, 5]

class C extends React.Component {
  render() {
    return (<div>asd</div>)

  }
}

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      counter: 1
    }
    setTimeout(() => {
      this.setState({ counter: this.state.counter + 1 })
    }, 1500);
    setTimeout(() => {
      this.setState({ counter: this.state.counter + 1 })
    }, 1800);
  }
  render() {
    return (
      <div key={1} >
        {this.state.counter}{this.state.counter}{this.state.counter}
        {this.state.counter%2 ===0?<div>1</div>:1}
        {this.state.counter}{this.state.counter}{this.state.counter}
        <div>ccccc</div>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);