import React from 'react'
import { connect } from 'react-redux'

const TodoItem = ({ key, value, title }) => (
    <div key={key}>{title + 1}.{value}</div>
)

class TodoList extends React.Component {
    onInputChange = (e) => {
        this.props.onInputChange(e.target.value)
    }
    onAdd = () => {
        this.props.add()
    }
    componentWillReceiveProps() {
        // this.setState({
        //     n: this.state.n + 1
        // })
    }
    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <h1>TodoList</h1>
                <p>你输入的内容：{this.props.inputText}</p>
                <div>
                    <input value={this.props.inputText} onChange={this.onInputChange} />
                    <button onClick={this.onAdd}>Add</button>
                    <div>
                        {this.props.list.map((item, index) => {
                            return <TodoItem key={index} title={index} value={item} />
                        })}
                    </div>
                </div>
            </div>
        )
    }
}


const mapState = (state) => {
    const { todoList } = state
    return {
        inputText: todoList.inputText,
        list: todoList.list
    }
}
const mapDispatch = (dispatch) => {

    return {
        onInputChange: (value) => dispatch({ type: 'input', value: value }),
        add: () => dispatch({ type: 'add' })
    }
}

const initState = {
    inputText: '',
    list: []
}

export const todoListReducer = (state = initState, action) => {
    if (action.type === 'input') {
        return { ...state, inputText: action.value }
    } else if (action.type === 'add') {
        return { ...state, list: [...state.list, state.inputText], inputText: '' }
    }

    return state
}
export default connect(mapState, mapDispatch)(TodoList)