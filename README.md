# Luy，一个类React框架

所谓类```React```框架就是**和React用法一模一样**的框架。其实当初制造这个框架的目的是为了能更好的学习React内部结构，了解其原理而制作的玩具。但是随着框架的渐渐成长，代码越来越多，我还是决定将其发展下去.
![](https://github.com/215566435/Luy/blob/master/luy%20icon2.jpg?raw=true)

跑学习案例
======
```
git clone https://github.com/215566435/Luy.git
cd Luy
npm install
npm run study
```


如何安装?
=====
```npm install --save luy```

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
