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
  constructor(props) {
    super(props)
    
    this.state = {
      counter: 1
    }
    // setInterval(() => {
    //   this.setState({ counter: this.state.counter + 1 })
    // }, 1500);

  }
  render(some) {

    return (
      <div key={1} style={{background:`rgb(99,99,${this.state.counter + 1})`}}>
        {this.state.counter}{this.state.counter}{this.state.counter}
        {this.state.counter%2 ===0?<div>1</div>:<h1></h1>}
        {this.state.counter%2 ===0?<div>1</div>:<h1></h1>}
        <div>ccccc</div>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);