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

// render()

// store.subscribe(render)

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
            <div onClick={this.handleClick} ref='testing' onTouchStart={this.handleClick}>
                <p>Number of clicks: {this.state.clicks}</p>
                <button ref='openDialog' onClick={this.ModalBtn}>点击这里会出现一个modal</button>
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

var body = document.body;
class Inner extends React.Component {
    render() {
        return <p>inner</p>;
    }
    componentWillUnmount() {
        // innerWillUnmount = true;
    }
    componentWillMount() {
        // innerWillMount = true;
    }
    componentDidMount() {
        // innerDidMount = true;
    }
}

class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            number: 1
        };
    }

    _show() {
        if (this.state.show) {
            return; //防止创建多个弹窗
        }
        this.setState({ show: true });
    }

    _close(e) {
        this.setState({ show: false });
    }

    render() {
        const { show } = this.state;
        console.log(this)
        return (
            <div
                className="Container"
                onClick={e => {
                    e.preventDefault();
                }}
            >
                <div className="hasClick" style={{ background: "#00bcd4" }} ref="openDialog" onClick={this._show.bind(this)}>
                    <div >Click me to show the Portal content</div>
                    <div>State: {(show && "visible") || "hidden"}</div>
                    <div ref="vdialog">
                        {show && (
                            <Portal>
                                <div style={{ background: "#ffeebb", height: 200 }}>
                                    <p ref="number">{this.state.number}</p>
                                    <Inner />
                                    <button ref="closeDialog" onClick={this._close.bind(this)} type="button">
                                        &times; close portal
                                    </button>
                                </div>
                            </Portal>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

class Portal extends React.Component {
    constructor(props) {
        super(props);
        this.node = document.createElement("div");
        this.node.id = "dynamic";
        body.appendChild(this.node);
    }
    componentWillUnmount() {
        body.removeChild(this.node);
    }
    render() {
        console.log(this);
        return ReactDOM.createPortal(this.props.children, this.node);
    }
}
var s = ReactDOM.render(<Container />, appRoot);


// const parent = ReactDOM.render(<Parent />, appRoot);
