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
import { disposeVnode } from './Luy/dispose';
import { noop } from './Luy/utils';

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

const logger = (msg) => {
    console.log(msg)
};

const ErrorBoundary = class extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
        logger(`${this.props.logName} constructor`);
    }
    render() {
        if (this.state.error && !this.props.forceRetry) {
            logger(`${this.props.logName} render error`);
            return this.props.renderError(this.state.error, this.props);
        }
        logger(`${this.props.logName} render success`);
        return <div>{this.props.children}</div>;
    }
    componentDidCatch(error, info) {
        logger(`${this.props.logName} componentDidCatch`);
        this.setState({ error });
    }
    componentWillMount() {
        logger(`${this.props.logName} componentWillMount`);
    }
    componentDidMount() {
        logger(`${this.props.logName} componentDidMount`);
    }
    componentWillReceiveProps() {
        logger(`${this.props.logName} componentWillReceiveProps`);
    }
    componentWillUpdate() {
        logger(`${this.props.logName} componentWillUpdate`);
    }
    componentDidUpdate() {
        logger(`${this.props.logName} componentDidUpdate`);
    }
    componentWillUnmount() {
        logger(`${this.props.logName} componentWillUnmount`);
    }
};
ErrorBoundary.defaultProps = {
    logName: "ErrorBoundary",
    renderError(error, props) {
        return <div ref={props.errorMessageRef}>Caught an error: {error.message}.</div>;
    }
};



var BrokenRender = class extends React.Component {
    constructor(props) {
        super(props);
        logger("BrokenRender constructor");
    }
    render() {
        logger("BrokenRender render [!]");
        throw new Error("Hello");
    }
    componentWillMount() {
        logger("BrokenRender componentWillMount");
    }
    componentDidMount() {
        logger("BrokenRender componentDidMount");
    }
    componentWillReceiveProps() {
        logger("BrokenRender componentWillReceiveProps");
    }
    componentWillUpdate() {
        logger("BrokenRender componentWillUpdate");
    }
    componentDidUpdate() {
        logger("BrokenRender componentDidUpdate");
    }
    componentWillUnmount() {
        logger("BrokenRender componentWillUnmount");
    }
};

const BrokenComponentWillMount = class extends React.Component {
    constructor(props) {
        super(props);
        logger("BrokenComponentWillMount constructor");
    }
    render() {
        logger("BrokenComponentWillMount render");
        return <div>{this.props.children}</div>;
    }
    componentWillMount() {
        logger("BrokenComponentWillMount componentWillMount [!]");
        throw new Error("Hello");
    }
    componentDidMount() {
        logger("BrokenComponentWillMount componentDidMount");
    }
    componentWillReceiveProps() {
        logger("BrokenComponentWillMount componentWillReceiveProps");
    }
    componentWillUpdate() {
        logger("BrokenComponentWillMount componentWillUpdate");
    }
    componentDidUpdate() {
        logger("BrokenComponentWillMount componentDidUpdate");
    }
    componentWillUnmount() {
        logger("BrokenComponentWillMount componentWillUnmount");
    }
};

const ErrorMessage = class extends React.Component {
    constructor(props) {
        super(props);
        logger("ErrorMessage constructor");
    }
    componentWillMount() {
        logger("ErrorMessage componentWillMount");
    }
    componentDidMount() {
        logger("ErrorMessage componentDidMount");
    }
    componentWillUnmount() {
        logger("ErrorMessage componentWillUnmount");
    }
    render() {
        logger("ErrorMessage render");
        return <div>Caught an error: {this.props.message}.</div>;
    }
};

function renderError(error) {
    return <ErrorMessage message={error.message} />;
}


var container3 = document.createElement("div");

appRoot.appendChild(container3)


const bc = (
    <ErrorBoundary renderError={renderError}>
        <BrokenComponentWillMount />
    </ErrorBoundary>
)
ReactDOM.render(
    bc,
    container3
);

disposeVnode(bc._instance.Vnode);


// ReactDOM.render(<span>After 1</span>, container1);
// ReactDOM.render(<span>After 2</span>, container2);
// ReactDOM.render(<ErrorBoundary forceRetry={true}>After 3</ErrorBoundary>, container3);

