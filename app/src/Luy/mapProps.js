import { typeNumber, isEventName } from "./utils";

var mappingStrategy = {
    style: function (domNode, style) {
        if (style !== undefined) {
            Object.keys(style).forEach((styleName) => {
                domNode.style[styleName] = style[styleName]
            })
        }
    },
    event: function (domNode, event, eventName) {
        console.log(eventName)
        document.addEventListener(eventName, dispatchEvent, false)
    },
    className: function (domNode, className) {
        if (className !== undefined) {
            domNode.className = className
        }
    }
}

function dispatchEvent(event,eventName,something){
    console.log(event,eventName,something)
}


export function mapProp(domNode, props) {

    for (let name in props) {
        if (name === 'children') continue
        if (isEventName(name)) {
            let eventName = name.slice(2).toLowerCase() //
            mappingStrategy['event'](domNode, props[name], eventName)
            continue
        }
        if (typeof mappingStrategy[name] === 'function') {
            mappingStrategy[name](domNode, props[name])
        }
    }
}

