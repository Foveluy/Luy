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

  }
  // shouldComponentUpdate(nextProps) {
  //   return this.props.name !== nextProps.name
  // }
  componentDidUpdate() {

    console.log('更新结束:context测试', this.context.fuck)
  }
  componentWillUnMount() {
    console.log('组件准备删除')
  }
  componentDidMount() {
    console.log('context测试', this.context.fuck)
  }
  click(e) {
    this.setState({
      c: this.state.c + 1
    })
    console.log('点击触发中：', this.state.c)
  }
  render() {
    return (
      <div>
        外部属性:{this.props.name}->>>>{this.state.c}
        <div>context fuck:{this.context.fuck}</div>
        <div>context shit:{this.context.shit}</div>
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

  getChildContext() {
    return {
      fuck: this.state.counter + 1,
      shit: 1
    }
  }

  componentDidMount() {
    console.log('组件挂载')
  }
  componentWillMount() {
    console.log('将要挂载')
  }
  componentDidUpdate() {
    console.log('更新完毕')
  }
  click(e) {
    this.setState(
      { counter: this.state.counter + 1 }
    )
    this.setState(
      { counter: this.state.counter + 2 }
    )
  }
  render() {
    return (
      <div key={1} style={{ background: `rgb(99,99,${this.state.counter})` }}>
        {<C name={this.state.counter} />}
        <button onClick={this.click.bind(this)}>点我</button>
      </div>
    )
  }
}

ReactDOM.render(
  <div>
    <App shit={'shit'} />
    <App shit={'shit'} />  
  </div>,
  document.getElementById('root')
);