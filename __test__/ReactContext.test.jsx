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


})