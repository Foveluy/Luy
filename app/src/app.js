import React from './Luy'
import ReactDOM from './Luy'
import { Component } from './Luy'
import {Children} from './Luy'
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
    return (<div>p1</div>)
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
                <div className='navigator container'>
                    <Link to="/">Home</Link>
                    <Link to="/page2">page2</Link>
                    <Route exact path="/" component={page1} />
                    <Route exact="/page2" component={page2} />
                </div>
            </Router>
        )
    }
}


class Drawer extends Component {
    render() {
        return <div><Linker/>12</div>
    }
}

const DrawerHOC = () => {
    return class Wrapper extends React.Component {
        render() {
            return <Drawer />
        }
    }
}

class W extends React.Component {

    state = {
        n: 1
    }
    onClick = () => {
        this.setState({
            n: this.state.n + 1
        })
    }
    render() {
        const HOC = DrawerHOC()
        return (
            <div>
                {this.state.n % 2 === 1 ? <HOC /> : 2}
                <button onClick={this.onClick}>点我</button>
            </div>
        )
    }
}

const reduer = (state = {}, action) => {
    return state
}

const store = createStore(reduer)
const Wrapper = connect()(W)

const render = () => (
    ReactDOM.render(
        <Provider store={store}>
            <div>
                <W />
            </div>
        </Provider>
        ,
        document.getElementById('root')
    )
)

render()

store.subscribe(render)

