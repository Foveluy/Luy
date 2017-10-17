import React from "../dist/index";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "../lib/ReactTestUtils";
import ReactShallowRenderer from "../lib/ReactShallowRenderer";

describe("ReactComponent", function () {

    it("子节点是列表", () => {
        let ummount = []
        class Life extends React.Component {
            componentWillUnMount() {
                ummount.push(this)
            }
            render() {
                return <div>asdasdsa</div>
            }
        }

        class Father extends React.Component {
            state = {
                check: 0
            }
            componentDidMount() {
                this.setState({
                    check: 1
                })
            }
            render() {
                return (
                    <div>
                        {
                            this.state.check == 1 ? 1
                                :
                                <div>
                                    <Life />
                                    <Life />
                                    <Life />
                                    <Life />
                                    <Life />
                                </div>
                        }
                    </div>
                )
            }
        }
        ReactTestUtils.renderIntoDocument(<Father />);
        expect(ummount.length).toBe(5)
    });

    it("子节点里面有子节点", () => {
        let ummount = []
        class Life extends React.Component {
            componentWillUnMount() {
                ummount.push(this)
            }
            render() {
                return <div>{this.props.children}</div>
            }
        }

        class Father extends React.Component {
            state = {
                check: 0
            }
            componentDidMount() {
                this.setState({
                    check: 1
                })
            }
            render() {
                return (
                    <div>
                        {
                            this.state.check == 1 ? 1
                                :
                                <div>
                                    <Life >
                                        <Life />
                                        <Life />
                                        <Life />
                                        <Life >
                                            <Life />
                                        </Life>
                                    </Life>
                                </div>
                        }
                    </div>
                )
            }
        }
        ReactTestUtils.renderIntoDocument(<Father />);
        expect(ummount.length).toBe(6)
    });

})
