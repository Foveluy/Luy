# Luy，一个类React框架

所谓类```React```框架就是**和React用法一模一样**的框架。其实当初制造这个框架的目的是为了能更好的学习React内部结构，了解其原理而制作的玩具。但是随着框架的渐渐成长，代码越来越多，我还是决定将其发展下去.
![](https://github.com/215566435/Luy/blob/master/luy%20icon2.jpg?raw=true)

如何安装?
=====
npm install --save luy

如何使用?
=====
和```React```一模一样，我们来看一个最简单的实例

```javascript
import React from 'luy'
import ReactDOM from 'luy'

class Luy extends React.Component {
  render() {
    return (
      <div>Hello,Luy!</div>
    )
  }
}

ReactDOM.render(<Luy/>, document.getElementById('root'))

```



todolist
-------

- [Luy第一版性能测试](http://htmlpreview.github.io/?https://github.com/215566435/Luy/blob/master/performance/luy/index.html)
- [react官方性能测试](http://htmlpreview.github.io/?https://github.com/215566435/Luy/blob/master/performance/react/index.html)
- [Anu性能测试](http://htmlpreview.github.io/?https://github.com/215566435/Luy/blob/master/performance/anu/index.html)


- [x] 第一次渲染
- [x] 虚拟DOM
- [x] 优化的diff算法(两端同时对比算法，比react快)
- [x] 用属性更新
- [x] 实现生命周期函数
- [x] setState异步机制实现
- [x] 事件冒泡系统
- [ ] 事件捕获系统
- [x] ref属性
- [x] 组件的context
- [x] createProtal Api
- [x] setState函数式参数
- [x] setState回调
- [x] 发布第一版本
- [x] 支持redux
- [x] 支持react-redux
- [x] 渲染null节点
- [x] 支持react-router
- [ ] createProtal 冒泡