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

class Linker extends React.Component {
    componentDidMount() {
        console.log('Linker componentDidMount')
    }
    componentDidCatch(info, msg) {
        console.log(msg);
    }
    render() {
        return (
            <Router>
                <div>
                    <ul>
                        <li><Link to="/">TodoList</Link></li>
                        <li><Link to="/layout">Layout系统</Link></li>
                        <li><Link to="/about">关于这个框架</Link></li>
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

const appRoot = document.getElementById('root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
    }

    componentDidMount() {
        modalRoot.appendChild(this.el);
    }

    componentWillUnmount() {
        modalRoot.removeChild(this.el);
    }

    render() {
        return ReactDOM.createPortal(
            this.props.children,
            this.el,
        );
    }
}

class Parent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clicks: 0,
            modal: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.ModalBtn = this.ModalBtn.bind(this);
    }

    handleClick(e) {
        console.log(e)
        if (e.target.className === 'mod') {
            this.setState({
                modal: false
            })
        } else {
            this.setState(prevState => ({
                clicks: prevState.clicks + 1
            }));
        }
    }
    ModalBtn() {
        this.setState({
            modal: !this.state.modal
        })
    }
    renderModal() {
        return (
            <Modal>
                <Child />
            </Modal>
        )
    }

    render() {
        return (
            <div onClick={this.handleClick} onTouchStart={this.handleClick}>
                <p>Number of clicks: {this.state.clicks}</p>
                <button onClick={this.ModalBtn}>点击这里会出现一个modal</button>
                {this.state.modal ? this.renderModal() : <div></div>}
            </div>
        );
    }
}

function Child() {
    return (
        <div
            className="mod"
            style={{
                top: 0,
                left: 0,
                display: 'flex',
                position: 'absolute',
                height: '100%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)'
            }}
        >
            <div>
                <h1>点击周围黑色，关掉modal</h1>
                <button>点击这里，数字增加</button>
            </div>
        </div>
    );
}

// ReactDOM.render(<Parent />, appRoot);