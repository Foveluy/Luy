import { flattenChildren } from './createElement'
import { typeNumber } from './utils'

export const Children = {
    //context不是组件的context而是组件上下文
    map(childVnode, callback, context) {
        if (childVnode === null || childVnode === undefined) {
            return [childVnode]
        }
        if (typeNumber(childVnode) !== 7) {
            return [callback.call(context, childVnode, 0)]
        }

        var ret = []
        flattenChildren(childVnode).forEach((oldVnode, index) => {
            let newVnode = callback.call(context, oldVnode, index)
            if (newVnode === null) {
                return
            }
            ret.push(newVnode)
        })
        return ret
    },
    only(childVnode) {
        if (typeNumber(childVnode) !== 7) {
            return childVnode
        }
        throw new Error("React.Children.only expect only one child, which means you cannot use a list inside a component");
    },
    count(childVnode) {
        if (childVnode === null) {
            return 0
        }
        if (typeNumber(childVnode) !== 7) {
            return 1
        }
        return flattenChildren(childVnode).length
    },
    forEach(childVnode, callback, context) {
        let flatten = flattenChildren(childVnode)

        if (typeNumber(flatten) === 7) {
            flattenChildren(childVnode).forEach(callback, context);
        } else {
            callback.call(context, childVnode, 0)
        }
    },

    toArray: function (childVnode) {
        if (childVnode == null) {
            return [];
        }
        return Children.map(childVnode, function (el) {
            return el;
        });
    }

}