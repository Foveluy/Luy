import React from 'react'
import ReactDOM from 'react-dom'
import { Component } from 'react'
import { Children } from 'react'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'


import { todoListReducer } from "./react-redux.exp"
import TodoList from "./react-redux.exp"

const page1 = () => {
    return (<div>p1</div>)
}
const page2 = () => {
    return (<div>p2</div>)
}
const page3 = () => {
    return (<div>p3</div>)
}

class Child extends React.Component {
    componentDidMount() {
        console.log(this.context)
    }
    render() {
        return <p> </p>
    }
}


class Linker extends React.Component {

    click(idx) {
        console.log(idx)
    }

    render() {
        return (
            <Router>
                <div>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/topics">Topics</Link></li>
                    </ul>

                    <hr />

                    <Route exact path="/" component={TodoList} />
                    <Route path="/about" component={page2} />
                    <Route path="/topics" component={page3} />
                </div>
            </Router>
        )
    }
}



const reducers = combineReducers({
    todoList: todoListReducer
})


const store = createStore(reducers)
const render = () => (
    ReactDOM.render(
        <Provider store={store}>
            <div>
                <Linker/>
            </div>
        </Provider>
        ,
        document.getElementById('root')
    )
)

render()

store.subscribe(render)

