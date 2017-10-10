import App from '../app/src/app'
import ReactTestUtils from '../lib/ReactTestUtils'
import getTestDocument from "./getTestDocument"
import React from '../app/src/Luy'
import ReactDOM from '../app/src/Luy'

describe('AddTodoView', () => {

    it('should allow children to be passed as an argument', () => {
        var argDiv = ReactTestUtils.renderIntoDocument(
            React.createElement('div', null, 'child'),
        );
        var argNode = ReactDOM.findDOMNode(argDiv);
        expect(argNode.innerHTML).toBe('child');
    })

    it('allows a DOM element to be used with a string', () => {
        var element = React.createElement('div', { className: 'foo' });
        var instance = ReactTestUtils.renderIntoDocument(element);
        expect(ReactDOM.findDOMNode(instance).tagName).toBe('DIV');
    })

    it('should overwrite props.children with children argument', () => {
        var conflictDiv = ReactTestUtils.renderIntoDocument(
            React.createElement('div', { children: 'fakechild' }, 'child'),
        );
        var conflictNode = ReactDOM.findDOMNode(conflictDiv);
        expect(conflictNode.innerHTML).toBe('child');
    })

    /**
   * We need to make sure that updates occur to the actual node that's in the
   * DOM, instead of a stale cache.
   */

    it('should purge the DOM cache when removing nodes', () => {
        var myDiv = ReactTestUtils.renderIntoDocument(
            <div>
                <div key="theDog" className="dog" />,
            <div key="theBird" className="bird" />
            </div>,
        );
        // Warm the cache with theDog
        myDiv = ReactTestUtils.renderIntoDocument(
            <div>
                <div key="theDog" className="dogbeforedelete" />,
            <div key="theBird" className="bird" />,
          </div>,
        );
        // Remove theDog - this should purge the cache
        myDiv = ReactTestUtils.renderIntoDocument(
            <div>
                <div key="theBird" className="bird" />,
          </div>,
        );
        // Now, put theDog back. It's now a different DOM node.
        myDiv = ReactTestUtils.renderIntoDocument(
            <div>
                <div key="theDog" className="dog" />,
            <div key="theBird" className="bird" />,
          </div>,
        );
        // Change the className of theDog. It will use the same element
        myDiv = ReactTestUtils.renderIntoDocument(
            <div>
                <div key="theDog" className="bigdog" />,
            <div key="theBird" className="bird" />,
          </div>,
        );
        var root = ReactDOM.findDOMNode(myDiv);
        var dog = root.childNodes[0];
        expect(dog.className).toBe('bigdog');
    });

    /**
 * If a state update triggers rerendering that in turn fires an onDOMReady,
 * that second onDOMReady should not fail.
 */
    it('it should fire onDOMReady when already in onDOMReady', () => {
        var _testJournal = [];

        class Child extends React.Component {
            componentDidMount() {
                _testJournal.push('Child:onDOMReady');
            }

            render() {
                return <div />;
            }
        }

        class SwitcherParent extends React.Component {
            constructor(props) {
                super(props);
                _testJournal.push('SwitcherParent:getInitialState');
                this.state = { showHasOnDOMReadyComponent: false };
            }

            componentDidMount() {
                _testJournal.push('SwitcherParent:onDOMReady');
                this.switchIt();
            }

            switchIt = () => {
                this.setState({ showHasOnDOMReadyComponent: true });
            };

            render() {
                return (
                    <div>
                        {this.state.showHasOnDOMReadyComponent ? <Child /> : <div />}
                    </div>
                );
            }
        }

        ReactTestUtils.renderIntoDocument(<SwitcherParent />);
        expect(_testJournal).toEqual([
            'SwitcherParent:getInitialState',
            'SwitcherParent:onDOMReady',
            'Child:onDOMReady',
        ]);
    });



})

