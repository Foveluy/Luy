import React, { Component } from 'react';

export class Test extends Component {
    state = {
        shit: 1
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                shit: this.state.shit + 1
            })
        }, 1000)
    }

    render() {

        if (this.state.shit % 2 === 0) {
            return [
                <div>2</div>,
                15,
                <div>2</div>,
                <div>2</div>
            ]
        }
        return [
            <div>{this.state.shit}</div>,
            <div>2</div>,
            <div>3</div>,
            <div>4</div>
        ]
    }
}