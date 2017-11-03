import React from 'react'
import ReactDOM from 'react-dom'
import { Component } from 'react'
import { Children } from 'react'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'


import { todoListReducer } from "./react-redux.exp"

import TodoList from "./react-redux.exp"
import LayoutDemo from './draggerLayout/App';

const page3 = () => {
    return (<div>本demo完全由luy框架提供,作者:方正</div>)
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
                        <li><Link to="/">TodoList</Link></li>
                        <li><Link to="/layout">Layout系统</Link></li>
                        <li><Link to="/about">关于</Link></li>
                    </ul>

                    <hr />

                    <Route exact path="/" component={TodoList} />
                    <Route path="/layout" component={LayoutDemo} />
                    <Route path="/about" component={page3} />
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
                <Linker />
            </div>
        </Provider>
        ,
        document.getElementById('root')
    )
)

render()

store.subscribe(render)

