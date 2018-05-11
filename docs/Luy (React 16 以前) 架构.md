> Luy，一个类 React 框架，所谓类 React 框架就是和 React 用法一模一样的框架。我的目标是，缔造一个和 React 一摸一样的框架。

目录：

* Luy (React 16 以前) 架构
  * 两个`createElement` ：一切的开始
    * document.createElement
    * React.createElement
    * React.createElement 函数的浅析
  * 构建虚拟 DOM
    * mountComponent
    * componentDidCatch
    * mount 其他节点
  * 组件的更新
    * updateComponent
    * React 事件的触发
    * React 16 几个特性的简单评价
* 本文到此结束

# Luy (React 16 以前) 架构

本文主要讲解、理清、复习 [Luy](https://github.com/Foveluy/Luy) 之前的架构，以方便在重构后和重构前的对比，内容较多，算是对自己的一个复习。

## 两个`createElement` ：一切的开始

#### document.createElement

在几年前，React 其实用的并不是 `document.createElement` 这个 API 去创建 DOM 节点，而是使用的 innerHTML 来创造 DOM 节点。换做这个的原因是因为 `document.createElement` 的速度远大于 innerHTML 这个东西。这一步的修改，给 React 带来了更大的性能提升。

在[官方博客](https://reactjs.org/blog/2016/04/07/react-v15.html)中，我们可以看到了官方给出的答案。

> Using document.createElement is also faster in modern browsers and fixes a number of edge cases >related to SVG elements and running multiple copies of React on the same page.

#### React.createElement

如果不是公共库作者，我想业务程序员已经很少很少使用这个 API 去做事情了，取而代之的，大家使用的是 `JSX` 来代替这个函数。 React 给我启示就是自造了一种叫做 JSX 的语法糖，来代替 `createElement`的调用，这里我就随便多嘴一句，不展开了。

将 `JSX` 转换成 React.createElement 的 Babel 插件叫做：

```
"transform-react-jsx",
      {
        "pragma": "React.createElement"
      }
```

其中 `pragma` 的设置，就是我们将`JSX`转化成的函数，`React.createElement` 是它的默认值。如果你改成：

```
"transform-react-jsx",
      {
        "pragma": "dom"
      }
```

那么对应的`JSX`就会变成：

```js
<div>1</div>
        |
        |
        v
dom('div',{},1)
```

#### React.createElement 函数的浅析

`createElement(type, config, ...children)`，这个函数的主要作用是构造一个 Vnode，所有的 DOM 节点，都会被对应到每一个 Vnode 中去，无论你是 虚拟 DOM 节点、还是虚拟组件、还是虚拟无状态组件，都会被 Luy 统一起来变成一个 Vnode。这个函数运行完毕以后，返回的 Vnode 节点，我们来看看：

```
function Vnode(type, props, key, ref) {
  this.owner = currentOwner.cur //这个是为了实现 ref的正确绑定
  this.type = type // 节点的 type
  this.props = props // 属性
  this.key = key //用于diff的key
  this.ref = ref // ref
}
```

然而，这个 Vnode 在 React 16 以后已经被改成了 fiber 结构，很多属性都已经不同，但是意义还是一样的：它是一个虚拟 DOM 节点。

## 构建虚拟 DOM

构建虚拟 DOM 实际上是通过 `Luy/vdom.js` 代码下的`render` 函数进行的。这个函数就是我们经常使用的`reactDOM.render`。这个函数一直有一个秘密，那就是它对已经绑定的节点，只会进行更新，而不是进行重新加载，这么做的原因是

* 为了实现服务端渲染的注水过程
* 使用 redux

代码其实很简单，就是做一个判断。对于同一个 dom 节点，运行两次 render，第一次是 mount，第二次是更新。

```js
if (typeNumber(container) !== 8) {
  throw new Error('Target container is not a DOM element.')
}

const UniqueKey = container.UniqueKey
if (container.UniqueKey) {
  //已经被渲染
  const oldVnode = containerMap[UniqueKey]
  const rootVnode = update(oldVnode, Vnode, container)
  runException()
  return Vnode._instance
} else {
  //第一次渲染的时候
  Vnode.isTop = true
  container.UniqueKey = mountIndexAdd()
  containerMap[container.UniqueKey] = Vnode
  renderByLuy(Vnode, container, false, Vnode.context, Vnode.owner)
  runException()
  return Vnode._instance
}
```

### 开始构建

开始构建虚拟 dom 的过程实际上是树的遍历，最简单的做法就是递归进行，在 Luy 中是这样的一个节奏：

```js
renderByLuy()
|
|
|                          原生节点
|                       document.createElement()
|                      /
v                    /          虚拟组件 (有状态组件、无状态组件）
根据节点信息 --> mountComponent()  ----> mountChild()渲染子节点  ---->根据子节点继续遍历
                     \
                      \         文字节点
                        mountTextComponent()
```

实际上，只要遇到树结构，都是这么个遍历的方法，递归一下就能够解决问题。

## mountComponent

`mountComponent` 这个函数做事情其实有些多

1.  新建虚拟组件 new 操作，获取一个实例
2.  实例判断是否有 render 方法，如果有没有 render 方法，那么这个就是一个无状态组件
3.  传递 context （实际上，在新的版本已经不这么做了）
4.  运行 `instance.componentWillMount` 声明周期函数
5.  运行 `render` 函数，在最新的 React 16 中，所有的生命周期函数都被一个叫做 `catchError` 的函数包裹了起来，这个函数实现了一个 `componentdidcatch`，这个函数。这个函数的实现是巨难的，后文我马上就说。
6.  `render` 操作之前，我们要记录下当前的 instance，这个 instance 为的就是让我们实现 ref，构建 ref 的过程也非常不好懂和极其复杂，为了保证每一个`render` 函数构建出来的 ref 和 当前组件的 instance 绑定一致，我们必须在 instance 产生以后，马上记录下来，`render`之后我们马上删除。
7.  `render`函数会产生又会产生一堆的 `Vnode`，拿到这些 Vnode 以后，我们又会回到 `renderByLuy` 里进行递归创建和插入。
8.  判断是否是`portal节点`，因为`portal`节点需要实现虚拟 DOM 的冒泡，因此，在这里需要动态创建一个节点作为占位符。
9.  运行`componentDidMount`，同样被`catchError`所包裹 10.检查之前所有的步骤里，是否有 setState 操作，如果有，则一次执行所有的 setState 操作。

### componentDidCatch

为什么说这个函数困难就是它不仅需要实现 Javascript 的 catch 功能，更要模拟错误堆栈和错误文件的行数(dev)。如果用过 `componentDidCatch` 你肯定知道，被这个组件包裹这下挂掉的组件，会根据用户挂载的树结构进行回溯。

要做到这一点，而且保证顺序是正确的，是非常困难和啰嗦的，看源码知道，当我们捕获所有的错误以后，会将自己（错误边界）之下的节点删除掉，每一个错误节点，只会处理一次错误，如果错误边界自己出了错误，那么会往上交给上面的边界错误节点来进行处理。

要实现这样的一种复杂逻辑，Luy 抽象出了一个 `runException` 函数。这个 `runException` 函数的调用也非常的隐秘和神器，在 mount 或者更新之后才会运行的。

## mount 其他节点

`mountNativeElement` 和 `mountTextComponent` 做的事情都差不多，一个是安装真实 dom，一个是安装文字节点。

# 组件的更新

组件的更新就是整个 React 精华的所在。这帮人做了那么久，一直就是在做这个过程。为了高性能的更新，React 实现了一套极其复杂的类数据库`事务处理`。

简单的理论来说，就是在一次事务以内，将所有的更新操作都塞入一个数组之中，当事务结束（所有回掉函数执行完毕），一次性进行更新。这种做法，就叫做 Debounce，延迟。

延迟带来的后果就是 setState 看似是异步的，但是实际上这个异步并不是真的异步，而是类似 nextTick 的回调，将所有的任务都集中在一个事件循环的末尾。

在`luy/component.js` 里，我们看到`setState`函数：

```js
if (this.lifeCycle === Com.CREATE) {
  //组件挂载期
} else {
  //组件更新期
  if (this.lifeCycle === Com.UPDATING) {
    return
  }

  if (this.lifeCycle === Com.MOUNTTING) {
    //componentDidMount的时候调用setState
    this.stateMergeQueue.push(1)
    return
  }

  if (this.lifeCycle === Com.CATCHING) {
    //componentDidMount的时候调用setState
    this.stateMergeQueue.push(1)
    return
  }

  if (options.async === true) {
    //事件中调用
    let dirty = options.dirtyComponent[this._uniqueId]
    if (!dirty) {
      options.dirtyComponent[this._uniqueId] = this
    }
    return
  }

  //不在生命周期中调用，有可能是异步调用
  this.updateComponent()
}
```

这个函数大部分情况下是会返回，而不是进行更新的。只有在某些异步情况下，脱离了事务以后才会进行更新。

## updateComponent

这个函数是更新的核心，那么触发这个函数的点在两个：

1.  不在生命周期中调用，有可能是异步调用(settimeout 之类的)
2.  每次事件触发结束以后就会检查 `dirtyComponent`，当每次事件触发以后，用户可能会设置 setState，当用户设置 `setState`以后，做两件事：把所有的 setState 内容都存在一个队列里，并标记这个 虚拟组件为脏的 3.事件回调结束以后，检查 `dirtyComponent`其中的每一个脏元素，然后对每一个脏元素进行`updateComponent`操作。
3.  全部更新结束以后，`dirtyComponent = {}//清空`

这些代码，能够在`luy/mapProps.js`中获取到

## React 事件的触发

React 事件的触发流程非常的诡异，这也跟它内部自己实现了一个事件触发系统有关系。原理其实很简单，把所有的事件统一注册到 document 上

```js
function addEvent(domNode, fn, eventName) {
  if (domNode.addEventListener) {
    domNode.addEventListener(eventName, fn, false)
  } else if (domNode.attachEvent) {
    domNode.attachEvent('on' + eventName, fn)
  }
}
```

我们可以看到，在这里 react 做了一套兼容，attachEvent 用于比较蠢的 IE

触发的路径是这样的，因为注册到了 document，比如是一个 click，无论你点哪里都会触发一个 event

```js
注册事件到 document，回掉函数是 dispatchEvent
|
v
click触发
|
|
v
document 会生成一个 event 对象
|
v
通过 event 对象中的 target (点击的 dom ）回溯出一条 path
|
v
拿到 path 以后，大循环触发 triggerEventByPath 上的所有回掉函数
```

在事件的回溯上，严重依赖了真实 dom 的 parent 属性，因此必须要对 dom 非常的熟悉了。

这里的所有代码，都能在 `luy/mapProps.js`中看到

## updateChildren

这个算法一直是 react 做得比较差的地方，在 luy 中，我使用了 另外一个出名的虚拟 dom 算法，速度不是最快，但是是最好理解的。

```js
对于同层的子节点，snabbdom主要有删除、创建的操作，同时通过移位的方法，达到最大复用存在
节点的目的，其中需要维护四个索引，分别是：

oldStartIdx => 旧头索引
oldEndIdx => 旧尾索引
newStartIdx => 新头索引
newEndIdx => 新尾索引
然后开始将旧子节点组和新子节点组进行逐一比对，直到遍历完任一子节点组，比对策略有5种：

oldStartVnode和newStartVnode进行比对，如果相似，则进行patch，然后新旧头索引都后移
oldEndVnode和newEndVnode进行比对，如果相似，则进行patch，然后新旧尾索引前移
oldStartVnode和newEndVnode进行比对，如果相似，则进行patch，将旧节点移位到最后
，新节点为【1,2,3,4,5】，如果缺乏这种判断，意味着需要先将5->1,1->2,2->3,3->4,4->5五
次删除插入操作，即使是有了key-index来复用，也会出现也会出现【5,1,2,3,4】->
【1,5,2,3,4】->【1,2,5,3,4】->【1,2,3,5,4】->【1,2,3,4,5】共4次操作，如果
有了这种判断，我们只需要将5插入到旧尾索引后面即可，从而实现右移
oldEndVnode和newStartVnode进行比对，处理和上面类似，只不过改为左移
 如果以上情况都失败了，我们就只能复用key相同的节点了。首先我们要通过createKeyToOldIdx
创建key-index的映射，如果新节点在旧节点中不存在，我们将它插入到旧头索引节点前，
然后新头索引向后；如果新节点在就旧节点组中存在，先找到对应的旧节点，然后patch，并将
旧节点组中对应节点设置为undefined,代表已经遍历过了，不再遍历，否则可能存在重复
插入的问题，最后将节点移位到旧头索引节点之前，新头索引向后
遍历完之后，将剩余的新Vnode添加到最后一个新节点的位置后或者删除多余的旧节点

/**
   *
     * @param parentElm 父节点
     * @param oldCh 旧节点数组
     * @param newCh 新节点数组
     * @param insertedVnodeQueue
     */
  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {

    var oldStartIdx = 0, newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, before;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      }
      //如果旧头索引节点和新头索引节点相同，
      else if (sameVnode(oldStartVnode, newStartVnode)) {
        //对旧头索引节点和新头索引节点进行diff更新， 从而达到复用节点效果
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        //旧头索引向后
        oldStartVnode = oldCh[++oldStartIdx];
        //新头索引向后
        newStartVnode = newCh[++newStartIdx];
      }
      //如果旧尾索引节点和新尾索引节点相似，可以复用
      else if (sameVnode(oldEndVnode, newEndVnode)) {
        //旧尾索引节点和新尾索引节点进行更新
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        //旧尾索引向前
        oldEndVnode = oldCh[--oldEndIdx];
        //新尾索引向前
        newEndVnode = newCh[--newEndIdx];
      }
        //如果旧头索引节点和新头索引节点相似，可以通过移动来复用
        //如旧节点为【5,1,2,3,4】，新节点为【1,2,3,4,5】，如果缺乏这种判断，意味着
        //那样需要先将5->1,1->2,2->3,3->4,4->5五次删除插入操作，即使是有了key-index来复用，
        // 也会出现【5,1,2,3,4】->【1,5,2,3,4】->【1,2,5,3,4】->【1,2,3,5,4】->【1,2,3,4,5】
        // 共4次操作，如果有了这种判断，我们只需要将5插入到最后一次操作即可
      else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      }
      //原理与上面相同
      else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      }
      //如果上面的判断都不通过，我们就需要key-index表来达到最大程度复用了
      else {
        //如果不存在旧节点的key-index表，则创建
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        //找到新节点在旧节点组中对应节点的位置
        idxInOld = oldKeyToIdx[newStartVnode.key];
        //如果新节点在旧节点中不存在，我们将它插入到旧头索引节点前，然后新头索引向后
        if (isUndef(idxInOld)) { // New element
          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          //如果新节点在就旧节点组中存在，先找到对应的旧节点
          elmToMove = oldCh[idxInOld];
          //先将新节点和对应旧节点作更新
          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
          //然后将旧节点组中对应节点设置为undefined,代表已经遍历过了，不在遍历，否则可能存在重复插入的问题

          oldCh[idxInOld] = undefined;
          //插入到旧头索引节点之前
          api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
          //新头索引向后
          newStartVnode = newCh[++newStartIdx];
        }
      }
    }
    //当旧头索引大于旧尾索引时，代表旧节点组已经遍历完，将剩余的新Vnode添加到最后一个新节点的位置后
    if (oldStartIdx > oldEndIdx) {
      before = isUndef(newCh[newEndIdx+1]) ? null : newCh[newEndIdx+1].elm;
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    }
    //如果新节点组先遍历完，那么代表旧节点组中剩余节点都不需要，所以直接删除
    else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }
```

上面这段代码揭示了为什么 react 需要 key ，而且 key 不能是 index 的根本原因。

## React 16 几个特性的简单评价

1.  返回任意的节点，如数组，字符串等。这一个实现起来并不是太困难，只需要做几个判断就能搞定
2.  createPortal 的制作，难点在于虚拟 DOM 的冒泡，这个需要构建一个空节点在虚拟 DOM 的位置来辅助
3.  ComponentDidcatch ，这个函数是最难实现的，实现了 fiber 之后，这个才能够很好的实现，在原有的 react 15 大前提之下，已经无法很好的实现了。

# 本文到此结束

* 本文是我对 luy 架构的一点复习，知识点非常的零散，因此我将其集中了起来，方便以后的复习。
* 最近要对 luy 进行重构，以便研究 react 的 fiber 架构，fiber 架构的研究对于前端的性能优化极其有借鉴作用
* 如果想要自己写一个 react 的话，可以看之前的文章，我已经把例子都修复好了

[方正造 luy ](https://zhuanlan.zhihu.com/p/30677179)
[方正造 luy](https://zhuanlan.zhihu.com/p/30726665)
