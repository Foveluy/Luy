import React from './Luy'
import ReactDOM from './Luy'
import Component from './Luy'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

class Drawer extends React.Component {
    render() {
        return <div>12</div>
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
        n: 0
    }
    onClick = () => {
        this.setState({
            n: this.state.n + 1
        })
    }
    render() {
        return (
            <div>
                {this.state.n % 2 === 1 ? <DrawerHOC /> : 2}
                <button onClick={this.onClick}>点我</button>
            </div>
        )
    }
}

ReactDOM.render(
    <div>
        <W/>
    </div>,
    document.getElementById('root')
)