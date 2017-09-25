import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import Dragger from './Dragger';

import './style.css';

var LayoutDemo = function (_React$Component) {
    _inherits(LayoutDemo, _React$Component);

    function LayoutDemo() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, LayoutDemo);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = LayoutDemo.__proto__ || _Object$getPrototypeOf(LayoutDemo)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            x: 0,
            y: 0
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(LayoutDemo, [{
        key: 'onDrag',
        value: function onDrag(e, x, y) {
            this.setState({
                x: x, y: y
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    Dragger,
                    { style: { left: 50 } },
                    React.createElement(
                        'div',
                        null,
                        '\u666E\u901A\u7684\u62D6\u62FD\u7EC4\u4EF6'
                    )
                ),
                React.createElement(
                    Dragger,
                    { allowY: false, style: { left: 250 } },
                    React.createElement(
                        'div',
                        null,
                        '\u4E0D\u5141\u8BB8\u5728y\u8F74\u79FB\u52A8'
                    )
                ),
                React.createElement(
                    Dragger,
                    { allowX: false, style: { left: 450 } },
                    React.createElement(
                        'div',
                        null,
                        '\u4E0D\u5141\u8BB8\u5728x\u8F74\u79FB\u52A8'
                    )
                ),
                React.createElement(
                    Dragger,
                    { onMove: this.onDrag.bind(this), style: { left: 650 } },
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'div',
                            null,
                            'x:',
                            this.state.x,
                            ' px'
                        ),
                        React.createElement(
                            'div',
                            null,
                            'y:',
                            this.state.y,
                            ' px'
                        )
                    )
                ),
                React.createElement(
                    Dragger,
                    { style: { left: 50, top: 200 }, hasDraggerHandle: true },
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'div',
                            {
                                className: 'handle',
                                style: {
                                    padding: 8, textAlign: 'center',
                                    background: 'rgba(120, 120, 120, 0.4)',
                                    marginBottom: 8,
                                    borderRadius: '5px',
                                    color: 'white'
                                }
                            },
                            '\u62D6\u62FD\u628A\u624B'
                        ),
                        React.createElement(
                            'div',
                            null,
                            '\u70B9\u628A\u624B\u62D6\u62FD'
                        )
                    )
                ),
                React.createElement(
                    Dragger,
                    { style: { left: 50, top: 400 }, hasCancelHandle: true },
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'div',
                            {
                                className: 'cancel',
                                style: {
                                    padding: 8, textAlign: 'center',
                                    background: 'rgba(120, 120, 120, 0.4)',
                                    marginBottom: 8,
                                    borderRadius: '5px',
                                    color: 'white'
                                }
                            },
                            '\u70B9\u8FD9\u65E0\u6CD5\u62D6\u52A8'
                        ),
                        React.createElement(
                            'div',
                            { style: { textAlign: 'center' } },
                            '\u70B9\u51FB\u62D6\u62FD'
                        )
                    )
                ),
                React.createElement(
                    Dragger,
                    { grid: [25, 25], style: { left: 250, top: 200 } },
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'div',
                            null,
                            '\u7F51\u683C\u79FB\u52A8'
                        ),
                        React.createElement(
                            'div',
                            null,
                            '\u6BCF\u6B21\u79FB\u52A830px'
                        )
                    )
                ),
                React.createElement(
                    Dragger,
                    { grid: [100, 100], style: { left: 450, top: 200 } },
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'div',
                            null,
                            '\u7F51\u683C\u79FB\u52A8'
                        ),
                        React.createElement(
                            'div',
                            null,
                            '\u6BCF\u6B21\u79FB\u52A8100px'
                        )
                    )
                ),
                React.createElement(
                    Dragger,
                    { 'static': true, style: { left: 650, top: 200 } },
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'div',
                            null,
                            '\u522B\u60F3\u62D6\u52A8\u6211'
                        )
                    )
                ),
                React.createElement(
                    Dragger,
                    { bounds: { left: 100, top: 100, right: 100, bottom: 100 }, style: { left: 250, top: 400 } },
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'div',
                            null,
                            '\u6211\u53EA\u80FD\u5728\u8303\u56F4100px\u5185\u79FB\u52A8'
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'bounds', style: { zIndex: -1, border: ' 1px solid rgba(120, 120, 120, 0.4)', left: 900, top: 200, width: 500, height: 500, position: 'absolute' } },
                    React.createElement(
                        Dragger,
                        { bounds: 'parent' },
                        React.createElement(
                            'div',
                            null,
                            '\u4E0D\u80FD\u79BB\u5F00\u6846\u6846\u7684\u8303\u56F4'
                        )
                    ),
                    React.createElement(
                        Dragger,
                        { bounds: 'parent', style: { left: 200, margin: 10 } },
                        React.createElement(
                            'div',
                            null,
                            React.createElement(
                                'div',
                                null,
                                '\u4E0D\u80FD\u79BB\u5F00\u6846\u6846\u7684\u8303\u56F4'
                            ),
                            React.createElement(
                                'div',
                                null,
                                '\u5E76\u4E14\u670910px\u7684margin'
                            )
                        )
                    )
                )
            );
        }
    }]);

    return LayoutDemo;
}(React.Component);

var _default = LayoutDemo;
export default _default;
;

var _temp2 = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(LayoutDemo, 'LayoutDemo', 'app/src/App.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'app/src/App.js');
}();

;