import React from './Luy'
import ReactDOM from './Luy'
import Component from './Luy'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
// import React from 'react'
// import ReactDOM from 'react-dom'
// import Component from '../../index'

// React component
class Counter extends React.Component {
  render() {
    const { value, onIncreaseClick } = this.props
    return (
      <div>
        <Child />
        <span>{value}</span>
        <button onClick={onIncreaseClick}>Increase</button>
        {React.Children.only(this.props.children)}
      </div>
    )
  }
}

const Child = () => {
  return (<div>shit</div>)
}


const HocTest = () => {
  return class wrapper extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return <Counter />
    }
  }
}




ReactDOM.render(
  <Counter >
    <div>12</div>
    </Counter>,
  document.getElementById('root')
)

// // Action
// const increaseAction = {type: 'increase' }

// // Reducer
// function counter(state = {count: 0 }, action) {
//   const count = state.count
//   switch (action.type) {
//     case 'increase':
//       return { count: count + 1 }
//     default:
//       return state
//   }
// }

// // Store
// const store = createStore(counter)

// // Map Redux state to component props
// function mapStateToProps(state) {
//   return {
//     value: state.count
//   }
// }

// // Map Redux actions to component props
// function mapDispatchToProps(dispatch) {
//   return {
//     onIncreaseClick: () => dispatch(increaseAction)
//   }
// }

// // Connected Component
// const App = connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Counter)

// ReactDOM.render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById('root')
// )