import React from "../app/src/Luy";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "../lib/ReactTestUtils";
import ReactShallowRenderer from "../lib/ReactShallowRenderer";

//https://github.com/facebook/react/blob/master/src/isomorphic/children/__tests__/ReactChildren-test.js
var ReactDOM = window.ReactDOM || React;

describe("ReactComponent", function () {

  it("should throw on invalid render targets", () => {
    class Root extends React.Component {

      render() {
        return (
          <div>
            <input type="text"/>
          </div>
        )
      }
    }
    ReactTestUtils.renderIntoDocument(<Root />);
  });
});
