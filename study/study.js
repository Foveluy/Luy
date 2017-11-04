import React from './createElement'

class Component {
    constructor(props) {
        this.props = props;
        this.state = this.state || {};

        this.nextState = null;
    }

    setState(partialState) {
        const preState = this.state;//存一份之前的，以后有用
        this.nextState = { ...this.state, ...partialState };//存一份新的，以后有用
        this.state = this.nextState;

        const oldVnode = this.Vnode;//注意这里，就是我们之前记录的Vnode.
        const newVnode = this.render();
        updateComponent(this, oldVnode, newVnode);//注意要把组件的实例传递过来  
    }
    render() { }
}

function updateComponent(instance, oldVnode, newVnode) {
    if (oldVnode.type === newVnode.type) {
        mapProps(oldVnode._hostNode, newVnode.props)
    } else {
        //remove
    }
}

function renderByLuy(Vnode, container) {
    if (!Vnode) return //判断一下，如果Vnode不是正常的值，那就返回了
    const {
        type,
        props
    } = Vnode;

    if (!type) return;
    const { children } = props;

    let domNode;
    const VnodeType = typeof type;
    if (VnodeType === 'function') {
        domNode = renderComponent(Vnode, container);
    } else if (VnodeType === 'string') {
        domNode = document.createElement(type);
    }

    mapProps(domNode, props);
    mountChildren(children, domNode);

    Vnode._hostNode = domNode;//用于回溯
    container.appendChild(domNode);
    return domNode;
}

function renderComponent(Vnode, container) {
    const ComponentClass = Vnode.type;
    const { props } = Vnode.props;
    const instance = new ComponentClass(props);

    const renderedVnode = instance.render();
    const domNode = renderByLuy(renderedVnode, container);

    instance.Vnode = renderedVnode;
    return domNode
}

function mountChildren(children, container) {
    //此时，children是一个Vnode，我们需要把他创建出来，挂在domNode上
    //因此我们又可以调用renderByLuy函数
    renderByLuy(children, container)
}

function mapProps(domNode, props) {
    for (let propsName in props) {
        if (propsName === 'children') continue; //不要把children也挂到真实DOM里面去
        if (propsName === 'style') {//这一步很明显了，就是把style css加进去
            let style = props['style'];
            //不熟悉的朋友，可以去看看什么是keys()
            Object.keys(style).forEach((styleName) => {
                domNode.style[styleName] = style[styleName];
                console.log(styleName)
            })
            continue;
        }
        domNode[propsName] = props[propsName]
    }
}

class FuckApp extends Component {
    constructor(props) {
        super(props);
        setInterval(function () {
            const color = ['#eee', 'black', 'red', 'green', 'blue','grey','#133234','#123213','222345','998232']
            const rand = parseInt(Math.min(10, Math.random() * 10))
            this.setState({
                color: color[rand]
            })
        }.bind(this), 1000);
    }
    state = {
        color: 'red'
    }

    render() {
        return <div
            style={{ height: '100px', width: '100px', background: this.state.color }}
            className='I am FuckApp component' />
    }
}


renderByLuy(
    <FuckApp />
    , document.getElementById('root')
);