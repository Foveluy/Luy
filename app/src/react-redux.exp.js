import React from 'react'
import { connect } from 'react-redux'

import './style.css'

var mountID = 0

const TodoItem = ({ key, value, title, onClose }) => (
    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <span style={{ fontSize: 15 }}>{title + 1}.{value}</span>
        <span
            className='todolist close'
            style={{
                width: 30,
                height: 30,
                fontSize: 20,
                border: "1px solid rgba(120,120,120,0.5)",
                borderRadius: '50%',
                textAlign: 'center'
            }}
            onClick={onClose}
        >-
        </span>
    </div>
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

                            return (<TodoItem
                                key={item.id}
                                title={index}
                                value={item.value}
                                onClose={() => { this.props.close(item.id) }}
                            />)
                        })}
                    </div>
                </div>
            </div>
        )
    }
}


const mapState = (state) => {
    const { todoList } = state
    console.log(todoList)
    return {
        inputText: todoList.inputText,
        list: todoList.list
    }
}
const mapDispatch = (dispatch) => {

    return {
        onInputChange: (value) => dispatch({ type: 'input', value: value }),
        add: () => dispatch({ type: 'add' }),
        close: (id) => dispatch({ type: 'delete', id: id })
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
        mountID++
        const listItem = { id: mountID, value: state.inputText }
        return { ...state, list: [...state.list, listItem], inputText: '' }
    } else if (action.type === 'delete') {
        const newList = state.list.filter((item) => {
            if (item.id !== action.id) {
                return item
            }
        })
        return { ...state, list: [...newList] }
    }

    return state
}
export default connect(mapState, mapDispatch)(TodoList)