import { typeNumber } from './utils'
export function setRef(Vnode, instance, domNode) {
    if (instance) {
        const refType = typeNumber(Vnode.ref)
        if (refStrategy[refType]) {
            refStrategy[refType](Vnode, Vnode.owner, domNode)
        }
    }
}

export function clearRefs(refs) {
    if (typeof refs === 'function') {
        refs(null)
    } else {
        for (let refName in refs) {
            refs[refName] = null
        }
    }
}

const refStrategy = {
    3: function (Vnode, instance, domNode) {
        if (Vnode._instance) {
            instance.refs[Vnode.ref] = Vnode._instance
        } else {
            instance.refs[Vnode.ref] = domNode
        }
    },
    4: function (Vnode, instance, domNode) {
        refStrategy[3](Vnode, instance, domNode)
    },
    5: function (Vnode, instance, domNode) {
        if (Vnode._instance) {
            Vnode.ref(Vnode._instance)
        } else {
            Vnode.ref(domNode)
        }
    }
}