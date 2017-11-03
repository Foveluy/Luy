import React from './createElement'

function renderByLuy(Vnode, container) {
    console.log(Vnode)
    if (!Vnode) return //判断一下，如果Vnode不是正常的值，那就返回了
    const {
        type,
        props
    } = Vnode;
    
    if (!type) return;
    const { children } = props;


    let domNode = document.createElement(type);
    mapProps(domNode, props);
    /* 
    注意这里的mountChildren函数的第二个参数是我们刚刚创建的domNode
    因为我们的孩子并不是挂在最开始的节点之下，我们的孩子应该挂在我们刚刚生成的节点之下
    因此，我们这里的参数传递的就是domNode
    */
    mountChildren(children, domNode);

    container.appendChild(domNode);
}

function mountChildren(children, domNode) {
    //此时，children是一个Vnode，我们需要把他创建出来，挂在domNode上
    //因此我们又可以调用renderByLuy函数
    renderByLuy(children, domNode)
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

renderByLuy(
    <div>
        <div>
            <div>
                <div>
                    <div>
                        <div>
                            <div />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    , document.getElementById('root')
);