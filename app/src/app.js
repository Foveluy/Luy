import React from './Luy'
import ReactDOM from './Luy'
import Component from './Luy'

let a = [1, 2, 3, 4, 5]

class C extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      c: 2
    }
  }
  componentWillReceiveProps(nextProps, nextContext) {
    console.log('目前的props:', this.props)
    console.log('下一个props:', nextProps)
  }

  click(e) {

    this.setState({
      c: this.state.c + 1
    })
  }
  render() {
    return (
      <div>
        外部属性:{this.props.name}->>>>{this.state.c}
        <button onClick={this.click.bind(this)}>点我C</button>
      </div>)

  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      counter: 1
    }
    // setInterval(() => {
    //   this.setState({ counter: this.state.counter + 1 })
    // }, 1500)
    // 
  }
  componentDidMount() {
    console.log('组件挂载')
  }
  componentWillMount() {
    console.log('将要挂载')

  }
  click(e) {
    this.setState(
      { counter: this.state.counter + 1 }
    )

  }
  render() {
    return (
      <div key={1} style={{ background: `rgb(99,99,99)` }}>
        <C name={this.state.counter}/>
        <button onClick={this.click.bind(this)}>点我</button>
      </div>
    )
  }
}

ReactDOM.render(
  <App shit={'shit'} />,
  document.getElementById('root')
);