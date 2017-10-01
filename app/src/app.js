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
      counter: 2
    }
    setInterval(() => {
      this.setState({ counter: this.state.counter + 1 })
    },1500)
    // 
  }
  render() {

    return (
      <div key={1} style={{ background: `rgb(99,99,${this.state.counter + 1})` }}>
        <div>
          {this.state.counter%2 ===0?1:[1,2,34,5].map((el,index)=>{
            if(index === 1)return <div>{this.state.counter}</div>
            return <div>{index}</div>
          })}
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);