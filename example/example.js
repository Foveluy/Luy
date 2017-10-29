import React from 'react'
import ReactDOM from 'react-dom'
import { Component } from 'react'
import { Children } from 'react'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

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

                    <Route exact path="/" component={page1} />
                    <Route path="/about" component={page2} />
                    <Route path="/topics" component={page3} />
                </div>
            </Router>
        )
    }
}


class Drawer extends Component {
    render() {
        return <div><Linker />12</div>
    }
}

const DrawerHOC = () => {
    return class Wrapper extends React.Component {
        render() {
            return <Drawer />
        }
    }
}

const List = () => {
    return (<div>
        <p>1</p>
        <p>1</p>
        <p>1</p>
    </div>)
}

class NULL extends React.Component {
    render() {
        return null
    }
}

class W extends React.Component {

    state = {
        n: 213123123123
    }
    onClick = () => {
        this.props.click()
        console.log(this.props.number)
        console.log(`state的大小：${this.state.n}`)
    }
    componentWillReceiveProps() {
        console.log('进来了')
        this.setState({
            n: this.state.n + 1
        })
    }
    render() {
        const HOC = DrawerHOC()
        return (
            <div>
                {<HOC />}
                {/* {<div><Drawer /></div>} */}
                {this.state.n}
                {this.props.number % 2 === 1 ? <div><NULL />{this.props.number}</div> : <List />}
                <button onClick={this.onClick}>点我</button>
            </div>
        )
    }
}

const reducer = (state = 1, action) => {

    if (action.type == 'type') {
        const newState = typeof state === 'object' ? action.number : state + action.number
        return newState
    }
    return state
}
const mapState = (state) => {
    console.log(state)
    return {
        number: state
    }
}
const mapDispatch = (dispatch) => {

    return {
        click: () => dispatch({ type: 'type', number: 1 })
    }
}

const store = createStore(reducer)
const Wrapper = connect(mapState, mapDispatch)(W)
const render = () => (
    ReactDOM.render(
        <Provider store={store}>
            <Wrapper />
        </Provider>
        ,
        document.getElementById('root')
    )
)



store.subscribe(render)

