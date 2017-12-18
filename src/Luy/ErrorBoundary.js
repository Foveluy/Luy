import { disposeVnode } from './dispose';
/**
 * 捕捉错误的核心代码，错误只会发生在用户事件回调，ref，setState回调，生命周期函数
 * @param {*} Instance 需要捕捉的虚拟组件实例
 * @param {*} hookname 用户事件回调，ref，setState回调，生命周期函数
 * @param {*} args 参数
 */
export function catchError(Instance, hookname, args) {
    try {
        if (Instance[hookname]) {
            const resulte = Instance[hookname].apply(Instance, args)
            return resulte
        }
    } catch (e) {
        // throw new Error(e);
        // console.error('暂时这么解决')
        disposeVnode(Instance.Vnode);
    }
}