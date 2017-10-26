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
    return class wrapper extends React.Component {
        render() {
            return <Drawer />
        }
    }
}

ReactDOM.render(
    <div>
        <DrawerHOC />
    </div>,
    document.getElementById('root')
)