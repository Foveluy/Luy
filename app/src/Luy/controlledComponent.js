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
    1: [
        "value",
        {
            onChange: 1,
            onInput: 1,
            readOnly: 1,
            disabled: 1
        },
        "oninput",
        preventUserInput
    ],
    2: [
        "checked",
        {
            onChange: 1,
            onClick: 1,
            readOnly: 1,
            disabled: 1
        },
        "onclick",
        preventUserClick
    ],
    3: [
        "value",
        {
            onChange: 1,
            disabled: 1
        },
        "onchange",
        preventUserChange
    ]
}


export const mapControlledElement = function (domNode, props) {
    const type = domNode.type
    const controllType = controllProps[type]
    if (controllType) {
        const data = controllData[controllType]//1.input 2.带有check的input 3.select
        const controllProp = data[0]//value --- input,check---input,value---select
        const otherProps = data[1]//如果元素定义了这些属性，那么就是受控属性，否则非受控
        const event = data[2]//每一种元素对应的防止用户输入的方法

        if (controllProp in props && !hasOtherControllProperty(props, otherProps)) {
            console.warn(`你为${domNode.nodeName}[type=${type}]元素指定了${controllProp}属性，
            但是没有提供另外的${Object.keys(otherProps)}来控制${controllProp}属性的变化
            那么它即为一个非受控组件，用户无法通过输入改变元素的${controllProp}值`);

            domNode._lastValue = props[controllProp]
            domNode[event] = data[3]
        } else {

        }

    }
}

function hasOtherControllProperty(props, otherProps) {
    for (var key in props) {
        if (otherProps[key]) {
            return true;
        }
    }
}

function preventUserInput(e) {
    var target = e.target
    var name = e.type === 'textarea' ? 'innerHTML' : 'value' //如果是textarea，他的输入保存在innerHTML里
    target[name] = target._lastValue
}

function preventUserChange(e) {
    const target = e.target,
        value = target._lastValue,
        options = target.options;
    if (target.multiple) {

    } else {
        updateOptionsOne(options, options.length, value)
    }

}
function preventUserClick(e) {
    e.preventDefault()
}

function updateOptionsOne(options, length, lastValue) {
    const stringValues = {}
    console.log(options)
    for (let i = 0; i < length; i++) {
        let option = options[i]
        let value = option.value
        if (value === lastValue) {
            option.selected = true
            return
        }
    }
    if (length) {
        //选中第一个
        options[0].selected = true
    }
}

function updateOptionsMore(options, length, lastValue) {
    var selectedValue = {}
    try {
        for (let i = 0; i < lastValue.length; i++) {
            selectedValue["&" + lastValue[i]] = true
        }
    } catch (e) {
        /* istanbul ignore next */
        console.warn('<select multiple="true"> 的value应该对应一个字符串数组')
    }
    for (let i = 0; i < n; i++) {
        let option = options[i]
        let value = option.value
        let selected = selectedValue.hasOwnProperty("&" + value)
        option.selected = selected
    }
}