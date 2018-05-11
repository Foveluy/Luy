import { typeNumber, isEventName, isEventNameLowerCase, options, styleHelper, noop } from "./utils";
import { SyntheticEvent } from './event'
import { mapControlledElement } from './controlledComponent'

const formElement = {
    INPUT: true,
    SELECT: true,
    TEXTAREA: true
}

function isFormElement(domNode) {
    if (domNode) {
        return formElement[domNode.nodeName]
    }
}

export function mapProp(domNode, props, Vnode) {
    if (Vnode && typeof Vnode.type === 'function') {
        //如果是组件，则不要map他的props进来
        return
    }

    if (isFormElement(domNode)) {
        mapControlledElement(domNode, props)
    }
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
        if (mappingStrategy[name] === undefined) {
            mappingStrategy['otherProps'](domNode, props[name], name)
        }
    }
}

export function clearEvents(domNode, props, Vnode) {
    console.log(domNode)
    for (let name in props) {
        if (name === 'children') continue
        if (isEventName(name)) {
            let eventName = name.slice(2).toLowerCase() //
            mappingStrategy['clearEvents'](domNode, props[name], eventName)
            continue
        }
    }
}


export function updateProps(oldProps, newProps, hostNode) {
    for (let name in oldProps) {//修改原来有的属性
        if (name === 'children') continue

        if (oldProps[name] !== newProps[name]) {
            mapProp(hostNode, newProps)
        }
    }

    let restProps = {}
    for (let newName in newProps) {//新增原来没有的属性
        if (oldProps[newName] === void 666) {
            restProps[newName] = newProps[newName]
        }
    }
    mapProp(hostNode, restProps)

}

var registerdEvent = {}
const controlledEvent = {
    change: 1,
    input: 1
}
function createHandle(e) {
    dispatchEvent(e, 'change');
}

const specialHook = {
    //react将text,textarea,password元素中的onChange事件当成onInput事件
    change: function (dom) {
        if (/text|password/.test(dom.type)) {
            addEvent(document, createHandle, "input");
        }
    }
}


export const mappingStrategy = {
    style: function (domNode, style) {
        if (style !== undefined) {
            Object.keys(style).forEach((styleName) => {
                domNode.style[styleName] = styleHelper(styleName, style[styleName])
            })
        }
    },
    clearEvents: function (domNode, eventCb, eventName) {
        let events = domNode.__events || {}
        events[eventName] = noop;
        domNode.__events = events//用于triggerEventByPath中获取event
    },
    event: function (domNode, eventCb, eventName) {
        let events = domNode.__events || {}
        events[eventName] = eventCb
        domNode.__events = events//用于triggerEventByPath中获取event

        if (!registerdEvent[eventName]) {//所有事件只注册一次
            registerdEvent[eventName] = 1

            if (specialHook[eventName]) {
                specialHook[eventName](domNode)
            } else {
                addEvent(document, dispatchEvent, eventName)
            }
        }
    },
    className: function (domNode, className) {
        if (className !== undefined) {
            domNode.className = className
        }
    },
    dangerouslySetInnerHTML: function (domNode, html) {
        let oldhtml = domNode.innerHTML
        if (html.__html !== oldhtml) {
            domNode.innerHTML = html.__html
        }
    },
    otherProps: function (domNode, prop, propName) {
        if (prop !== void 666 || propName !== void 666) {
            domNode[propName] = prop
        }
    }
}


function addEvent(domNode, fn, eventName) {

    if (domNode.addEventListener) {
        domNode.addEventListener(
            eventName,
            fn,
            false
        );

    } else if (domNode.attachEvent) {
        domNode.attachEvent("on" + eventName, fn);
    }
}

function dispatchEvent(event, eventName, end) {
    const path = getEventPath(event, end)
    let E = new SyntheticEvent(event)
    options.async = true
    if (eventName) {
        E.type = eventName
    }

    triggerEventByPath(E, path)//触发event默认以冒泡形式
    options.async = false
    for (let dirty in options.dirtyComponent) {
        options.dirtyComponent[dirty].updateComponent()
    }
    options.dirtyComponent = {}//清空
}

/**
 * 触发event默认以冒泡形式
 * 冒泡：从里到外
 * 捕获：从外到里
 * @param {array} path 
 */
function triggerEventByPath(e, path) {
    const thisEvenType = e.type
    for (let i = 0; i < path.length; i++) {
        const events = path[i].__events
        for (let eventName in events) {
            let fn = events[eventName]
            e.currentTarget = path[i]
            if (typeof fn === 'function' && thisEvenType === eventName) {

                fn.call(path[i], e)//触发回调函数默认以冒泡形式
            }
        }
    }
}

/**
 * 当触发event的时候，我们利用这个函数
 * 去寻找触发路径上有函数回调的路径
 * @param {event} event 
 */
export function getEventPath(event, end) {
    let path = []
    let pathEnd = end || document
    let begin = event.target

    while (1) {
        if (begin.__events) {
            path.push(begin)
        }
        begin = begin.parentNode//迭代
        if (begin && begin._PortalHostNode) {
            begin = begin._PortalHostNode
        }
        if (!begin) {
            break
        }
    }
    return path
}




