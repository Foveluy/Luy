import { disposeVnode } from './dispose';
import { typeNumber, noop } from './utils';

var _errorVnode = [];
var V_Instance = [];
var errorMsg = '';
var error = undefined;

/**
 * 捕捉错误的核心代码，错误只会发生在用户事件回调，ref，setState回调，生命周期函数
 * @param {*} Instance 需要捕捉的虚拟组件实例
 * @param {*} hookname 用户事件回调，ref，setState回调，生命周期函数
 * @param {*} args 参数
 */
export function catchError(Instance, hookname, args) {
    try {
        if (Instance[hookname]) {
            var resulte = void 666;
            if (hookname === 'render') {
                resulte = Instance[hookname].apply(Instance)
            }
            resulte = Instance[hookname].apply(Instance, args)
            return resulte
        }
    } catch (e) {
        // throw new Error(e);
        // disposeVnode(Instance.Vnode);
        let Vnode = void 666;
        Vnode = Instance.Vnode;
        if (hookname === 'render') {
            Vnode = args[0];
        }
        collectErrorVnode(e, Vnode);
    }
}

export function getReturn(Vnode) {
    if (Vnode.return === void 666) {
        return Vnode
    } else {
        if (Vnode.displayName === void 666) {
            return Vnode.return
        } else {
            return Vnode
        }
    }
}
function getName(Vnode, type) {
    const type_number = typeNumber(type);
    if (type_number === 4) {
        return type
    }
    if (type_number === 5) {
        if (Vnode._hostNode) {
            return Vnode._hostNode.tagName
        } else {
            return Vnode.type.name
        }
    }

}

function pushErrorVnode(Vnode) {
    _errorVnode.push(Vnode);
}

export function collectErrorVnode(error, _Vnode) {
    var Vnode = _Vnode === void 666 ? void 666 : _Vnode.return;
    const error_ary = [];
    do {
        if (Vnode === void 666) break;
        error_ary.push(Vnode);
        if (Vnode.return) {
            // console.log(`<${Vnode.displayName || getName(Vnode, Vnode.type)}/> created by ${Vnode.return.displayName || getName(Vnode.return, Vnode.return.type)}`)
            errorMsg += `in <${Vnode.displayName || getName(Vnode, Vnode.type)}/> created by ${Vnode.return.displayName || getName(Vnode.return, Vnode.return.type)}\n`;
            if (Vnode._instance) {
                if (Vnode._instance.componentDidCatch) {
                    V_Instance.push({
                        instance: Vnode._instance,
                        componentDidCatch: Vnode._instance.componentDidCatch
                    });
                }
                // console.log(`<${Vnode.displayName || getName(Vnode, Vnode.type)}/> 拥有医生节点的能力`)
            }
        }
    }
    while (Vnode = Vnode.return);
    if (V_Instance.length === 0) {
        throw error;
    }
}

export function runException() {
    var ins = V_Instance.shift()
    if (ins === void 666) {
        if (errorMsg !== '') {
            // console.warn(errorMsg)
        }
        return
    }
    do {

        const { instance, componentDidCatch } = ins;
        if (componentDidCatch) {
            try {
                componentDidCatch.call(instance, error, errorMsg);
                disposeVnode(instance.Vnode);
                break;
            } catch (e) {
                console.log(e, '多个错误发生，此处只处理一个错误');
            }
        }
    } while (ins = V_Instance.shift())
}