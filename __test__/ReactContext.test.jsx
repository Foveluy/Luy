import React from "../app/src/Luy";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "../lib/ReactTestUtils";
import ReactShallowRenderer from "../lib/ReactShallowRenderer";

//https://github.com/facebook/react/blob/master/src/isomorphic/children/__tests__/ReactChildren-test.js
var ReactDOM = window.ReactDOM || React;

describe("ReactComponent", function () {

    //context穿透更新
    it("should pass context when re-rendered for static child", () => {
        var parentInstance = null;
        var childInstance = null;

        class Parent extends React.Component {

            state = {
                flag: false
            };

            getChildContext() {
                return {
                    foo: "bar",
                    flag: this.state.flag
                };
            }

            render() {
                return React.Children.only(this.props.children);
            }
        }

        class Middle extends React.Component {
            render() {
                return this.props.children;
            }
        }

        class Child extends React.Component {

            render() {
                childInstance = this;
                return <span>Child</span>;
            }
        }

        parentInstance = ReactTestUtils.renderIntoDocument(
            <Parent>
                <Middle>
                    <Child />
                </Middle>
            </Parent>
        );

        expect(parentInstance.state.flag).toBe(false);
        expect(childInstance.context).toEqual({ foo: "bar", flag: false });

        parentInstance.setState({ flag: true });
        expect(parentInstance.state.flag).toBe(true);
        expect(childInstance.context).toEqual({ foo: "bar", flag: true });
    });
    //context穿透更新
    it("should pass context when re-rendered for static child within a composite component", () => {
        class Parent extends React.Component {

            state = {
                flag: true
            };

            getChildContext() {
                return {
                    flag: this.state.flag
                };
            }

            render() {
                return <div>{this.props.children}</div>;
            }
        }

        class Child extends React.Component {


            render() {
                return <div />;
            }
        }

        class Wrapper extends React.Component {
            render() {
                return (
                    <Parent ref="parent">
                        <Child ref="child" />
                    </Parent>
                );
            }
        }

        var wrapper = ReactTestUtils.renderIntoDocument(<Wrapper />);

        expect(wrapper.refs.parent.state.flag).toEqual(true);
        expect(wrapper.refs.child.context).toEqual({ flag: true });

        // We update <Parent /> while <Child /> is still a static prop relative to this update
        wrapper.refs.parent.setState({ flag: false });

        expect(wrapper.refs.parent.state.flag).toEqual(false);
        expect(wrapper.refs.child.context).toEqual({ flag: false });
    });

    it("should pass context transitively", () => {
        var childInstance = null;
        var grandchildInstance = null;

        class Parent extends React.Component {
            getChildContext() {
                return {
                    foo: "bar",
                    depth: 0
                };
            }
            render() {
                return <Child />;
            }
        }

        class Child extends React.Component {


            getChildContext() {
                return {
                    depth: this.context.depth + 1
                };
            }

            render() {
                childInstance = this;
                return <Grandchild />;
            }
        }

        class Grandchild extends React.Component {

            render() {
                grandchildInstance = this;
                return <div />;
            }
        }

        ReactTestUtils.renderIntoDocument(<Parent />);
        expect(childInstance.context).toEqual({ foo: "bar", depth: 0 });
        expect(grandchildInstance.context).toEqual({ foo: "bar", depth: 1 });
    });

    it("should pass context when re-rendered", () => {
        var parentInstance = null;
        var childInstance = null;

        class Parent extends React.Component {

            state = {
                flag: false
            };

            getChildContext() {
                return {
                    foo: "bar",
                    depth: 0
                };
            }

            render() {
                var output = <Child />;
                if (!this.state.flag) {
                    output = <span>Child</span>;
                }
                return output;
            }
        }

        class Child extends React.Component {


            render() {
                childInstance = this;
                return <span>Child</span>;
            }
        }

        parentInstance = ReactTestUtils.renderIntoDocument(<Parent />);
        expect(childInstance).toBeNull();

        expect(parentInstance.state.flag).toBe(false);
        /*
    ReactDOM.unstable_batchedUpdates(function() {
      parentInstance.setState({flag: true});
    });
    expect(parentInstance.state.flag).toBe(true);
    expect(childInstance.context).toEqual({foo: 'bar', depth: 0});
    */
    });
    it("unmasked context propagates through updates", () => {
        class Leaf extends React.Component {

            componentWillReceiveProps(nextProps, nextContext) {
                expect("foo" in nextContext).toBe(true);
            }

            shouldComponentUpdate(nextProps, nextState, nextContext) {
                expect("foo" in nextContext).toBe(true);
                return true;
            }

            render() {
                return <span>{this.context.foo}</span>;
            }
        }

        class Intermediary extends React.Component {
            componentWillReceiveProps(nextProps, nextContext) {
                console.log("unmasked context propagates through updates",nextContext)
                expect("foo" in nextContext).toBe(false);
            }

            shouldComponentUpdate(nextProps, nextState, nextContext) {
                expect("foo" in nextContext).toBe(false);
                return true;
            }

            render() {
                return <Leaf />;
            }
        }

        class Parent extends React.Component {

            getChildContext() {
                return {
                    foo: this.props.cntxt
                };
            }

            render() {
                return <Intermediary />;
            }
        }

        var div = document.createElement("div");
        ReactDOM.render(<Parent cntxt="1noise" />, div);
        expect(div.children[0].innerHTML).toBe("1noise");
        div.children[0].innerHTML = "aliens";
        div.children[0].id = "aliens";
        expect(div.children[0].innerHTML).toBe("aliens");
        expect(div.children[0].id).toBe("aliens");
        ReactDOM.render(<Parent cntxt="bar" />, div);
        expect(div.children[0].innerHTML).toBe("bar");
        expect(div.children[0].id).toBe("aliens");
    });

    it("should trigger componentWillReceiveProps for context changes", () => {
        var contextChanges = 0;
        var propChanges = 0;

        class GrandChild extends React.Component {


            componentWillReceiveProps(nextProps, nextContext) {
                expect("foo" in nextContext).toBe(true);

                if (nextProps !== this.props) {
                    propChanges++;
                }

                if (nextContext !== this.context) {
                    contextChanges++;
                }
            }

            render() {
                return <span className="grand-child">{this.props.children}</span>;
            }
        }

        class ChildWithContext extends React.Component {


            componentWillReceiveProps(nextProps, nextContext) {
                expect("foo" in nextContext).toBe(true);

                if (nextProps !== this.props) {
                    propChanges++;
                }

                if (nextContext !== this.context) {
                    contextChanges++;
                }
            }

            render() {
                return <div className="child-with">{this.props.children}</div>;
            }
        }

        class ChildWithoutContext extends React.Component {
            componentWillReceiveProps(nextProps, nextContext) {
                expect("foo" in nextContext).toBe(false);

                if (nextProps !== this.props) {
                    propChanges++;
                }

                if (nextContext !== this.context) {
                    contextChanges++;
                }
            }

            render() {
                return <div className="child-without">{this.props.children}</div>;
            }
        }

        class Parent extends React.Component {


            state = {
                foo: "abc"
            };

            getChildContext() {
                return {
                    foo: this.state.foo
                };
            }

            render() {
                return <div className="parent">{this.props.children}</div>;
            }
        }

        var div = document.createElement("div");

        var parentInstance = null;
        ReactDOM.render(
            <Parent ref={inst => (parentInstance = inst)}>
                <ChildWithoutContext>
                    A1
                    <GrandChild>A2</GrandChild>
                </ChildWithoutContext>

                <ChildWithContext>
                    B1
                    <GrandChild>B2</GrandChild>
                </ChildWithContext>
            </Parent>,
            div
        );

        parentInstance.setState({
            foo: "def"
        });

        expect(propChanges).toBe(0);
        expect(contextChanges).toBe(3); // ChildWithContext, GrandChild x 2
    });

})