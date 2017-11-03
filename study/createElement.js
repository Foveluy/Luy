function Vnode(type, props, key, ref) {
    this.type = type
    this.props = props
    this.key = key
    this.ref = ref
}


function createElement(type, config, ...children) {
    //这几行基本是废话
    
    let props = {},
        key = null,
        ref = null,
        childLength = children.length;


    if (config != null) {
        //巧妙的将key转化为字符串或者null
        key = config.key === undefined ? null : '' + config.key;
        //元素的ref可能是
        ref = config.ref === undefined ? null : config.ref;

        /**这一步就是将config属性放进props里 */
        for (let propName in config) {
            // 除去一些不需要的属性,key,ref等
            //注意，我们的props里不要出现key,ref这些蛋疼的东西
            //在我们使用React的时候，props里也没有key(不信你去打印一下
            if (propName === 'key' || propName === 'ref') continue;
            //保证所有的属性都不是undefined
            if (config.hasOwnProperty(propName)) {
                props[propName] = config[propName];
            }
        }
    }

    //把children丢进props里，就可以了
    //还记得我们React的children的用法吗？
    //this.props.children就是在这里加进来的
    if( childLength === 1){
        props.children = children[0];
    }else{
        props.children = children;
    }
    
    //最后甩回去一个Vnode
    return new Vnode(type, props, key, ref);
}

export default React = {
    createElement: createElement
}
