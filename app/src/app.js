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
      this.setState({ counter: this.state.counter + 2 })
    }, 1500);
  }
  render() {
    return (
      <div key={1} >
        <div style={{ height: `${10 * this.state.counter}px`, border: '1px solid black', transition: 'all 0.2s' }}>12</div>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);