import React from "../src/Luy";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "../lib/ReactTestUtils";
import ReactShallowRenderer from "../lib/ReactShallowRenderer";

//https://github.com/facebook/react/blob/master/src/isomorphic/children/__tests__/ReactChildren-test.js
var ReactDOM = window.ReactDOM || React;

describe("ref机制清理", function () {

    //context穿透更新
    it("ref得到清理", () => {
        var parentInstance = null;
        var number = 0

        class Parent extends React.Component {

            state = {
                flag: false
            };

            render() {
                const child = (<div ref='fuck'>
                    <Child />
                    <Child />
                    <Child />
                    <Child />
                    <Child />
                    {this.props.children}
                </div>)

                return (
                    <div>{this.state.flag ? child : null}</div>
                )
            }
        }


        class Child extends React.Component {
            componentWillUnmount() {
                number++
            }

            render() {
                childInstance = this;
                return <span>Child</span>;
            }
        }

        parentInstance = ReactTestUtils.renderIntoDocument(
            <Parent>
                <Child />
            </Parent>
        );
        parentInstance.setState({
            flag: false
        })

        var bool = parentInstance.refs.fuck ? true : false;
        expect(bool).toBe(false);

    });


})