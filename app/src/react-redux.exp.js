import React from 'react'
import { connect } from 'react-redux'
class TodoList extends React.Component {

    state = {
        n: ''
    }
    onInputChange = (e) => {
        console.log(e.target.value)
        // this.props.click()
        this.setState({
            n: e.target.value
        })
    }
    onAdd = () => {

    }
    componentWillReceiveProps() {
        this.setState({
            n: this.state.n + 1
        })
    }
    render() {
        return (
            <div>

                <h1>TodoList</h1>
                {this.state.n}
                <input value={this.state.n} type='text' onChange={this.onInputChange} />
                <div>{this.props.number}</div>
                <button onClick={this.onAdd}>Add</button>
            </div>
        )
    }
}


const mapState = (state) => {
    console.log(state)
    return {
        number: state.todoList
    }
}
const mapDispatch = (dispatch) => {

    return {
        click: () => dispatch({ type: 'type', number: 1 })
    }
}

export const todoListReducer = (state = 1, action) => {

    if (action.type == 'type') {
        const newState = typeof state === 'object' ? action.number : state + action.number
        return newState
    }
    return state
}
export default connect(mapState, mapDispatch)(TodoList)