"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mapControlledElement = undefined;

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var controllProps = {
    color: 1,
    date: 1,
    datetime: 1,
    "datetime-local": 1,
    email: 1,
    month: 1,
    number: 1,
    password: 1,
    range: 1,
    search: 1,
    tel: 1,
    text: 1,
    time: 1,
    url: 1,
    week: 1,
    textarea: 1,
    checkbox: 2,
    radio: 2,
    "select-one": 3,
    "select-multiple": 3
};

var controllData = {
    1: ["value", {
        onChange: 1,
        onInput: 1,
        readOnly: 1,
        disabled: 1
    }, "oninput", preventUserInput],
    2: ["checked", {
        onChange: 1,
        onClick: 1,
        readOnly: 1,
        disabled: 1
    }, "onclick", preventUserClick],
    3: ["value", {
        onChange: 1,
        disabled: 1
    }, "onchange", preventUserChange]
};

var mapControlledElement = exports.mapControlledElement = function mapControlledElement(domNode, props) {
    var type = domNode.type;
    var controllType = controllProps[type];
    if (controllType) {
        var data = controllData[controllType]; //1.input 2.带有check的input 3.select
        var controllProp = data[0]; //value --- input,check---input,value---select
        var otherProps = data[1]; //如果元素定义了这些属性，那么就是受控属性，否则非受控
        var event = data[2]; //每一种元素对应的防止用户输入的方法

        if (controllProp in props && !hasOtherControllProperty(props, otherProps)) {
            console.warn("\u4F60\u4E3A" + domNode.nodeName + "[type=" + type + "]\u5143\u7D20\u6307\u5B9A\u4E86" + controllProp + "\u5C5E\u6027\uFF0C\n            \u4F46\u662F\u6CA1\u6709\u63D0\u4F9B\u53E6\u5916\u7684" + (0, _keys2.default)(otherProps) + "\u6765\u63A7\u5236" + controllProp + "\u5C5E\u6027\u7684\u53D8\u5316\n            \u90A3\u4E48\u5B83\u5373\u4E3A\u4E00\u4E2A\u975E\u53D7\u63A7\u7EC4\u4EF6\uFF0C\u7528\u6237\u65E0\u6CD5\u901A\u8FC7\u8F93\u5165\u6539\u53D8\u5143\u7D20\u7684" + controllProp + "\u503C");

            domNode._lastValue = props[controllProp];
            domNode[event] = data[3];
        } else {}
    }
};

function hasOtherControllProperty(props, otherProps) {
    for (var key in props) {
        if (otherProps[key]) {
            return true;
        }
    }
}

function preventUserInput(e) {
    var target = e.target;
    var name = e.type === 'textarea' ? 'innerHTML' : 'value'; //如果是textarea，他的输入保存在innerHTML里

    target[name] = target._lastValue;
}

function preventUserChange(e) {
    var target = e.target,
        value = target._lastValue,
        options = target.options;
    if (target.multiple) {} else {
        updateOptionsOne(options, options.length, value);
    }
}
function preventUserClick(e) {
    e.preventDefault();
}

function updateOptionsOne(options, length, lastValue) {
    var stringValues = {};
    console.log(options);
    for (var i = 0; i < length; i++) {
        var option = options[i];
        var value = option.value;
        if (value === lastValue) {
            option.selected = true;
            return;
        }
    }
    if (length) {
        //选中第一个
        options[0].selected = true;
    }
}

function updateOptionsMore(options, length, lastValue) {
    var selectedValue = {};
    try {
        for (var i = 0; i < lastValue.length; i++) {
            selectedValue["&" + lastValue[i]] = true;
        }
    } catch (e) {
        /* istanbul ignore next */
        console.warn('<select multiple="true"> 的value应该对应一个字符串数组');
    }
    for (var _i = 0; _i < n; _i++) {
        var option = options[_i];
        var value = option.value;
        var selected = selectedValue.hasOwnProperty("&" + value);
        option.selected = selected;
    }
}