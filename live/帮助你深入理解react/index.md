1. react 三个主要方面
- UI = f(data)
- 一切都是组件
- 声明式编程

2. 声明式编程的好处
命令式和声明式编程区别:
命令式编程: 命令‘机器’如何做事情(how)，不管想要什么(what)，都会按照你的命令实现。
声明式编程: 告诉‘机器’你想要的是什么(what),让机器想出如何去做(how)。
声明式编程让我们去描述我们想要的是什么，让底层的软件去解决如何实现它们。
声明式编程的好处: 
- 让开发者的工作简化了
React中，也许你能使用jquery写出更厉害的代码，但是react处理Dom更专业。比手动处理的更加高效
- 声明式编程减少了重复的工作
React让开发者不用再记忆jQuery那变幻无穷的DOM操作方式了，一样也是避免了重复劳动，减少了出bug的可能。
- 声明式编程留下了改进的空间
在react世界中，如果React有个重大的内部结构改进，比如:react Fiber,虽然算法改头换面，但组件却几乎不用改，因为组件只操心“显示什么”而不用关心“如何显示”，所以不受影响。
- 声明式编程提供了全局协调能力
React中，每个组件只是声明“想要画成什么样子”，但是React却可以改进协调算法，让React组件根据不同的优先级来渲染，提高用户感知性能。但是React组件的代码不需要改变，也是一样的道理。

3. virtual-Dom如何工作
- 动态使用子组件的时候需要使用Key
传统的准确diff算法,需要O(n3)的时间复杂度。如果有1000个节点，如果要精确的得到两个树结构的差异,需要1百万次的比对运算。

从根结点以递归的方式进行比对,
* 第一步先看两个节点类型是否相同,如果类型不同则认为这个节点改变,直接unmount,然后mount新节点。
* 把一个节点从一个位置移动到另外一个节点, 则会删除然后重新挂载新的节点。
* (动态产生的子组件)假设有三个兄弟节点A,B,C。然后在AB中间插入一个新的节点X。最暴力的方式:是直接删除然后从新渲染，但是如果加上一个key值。则让react识别只是新增了一个新的组件(TODO)。
key值两个要素:
- 兄弟节点直接必须是唯一的
- 必须是稳定的, 无论多少次的渲染必须是确定。(key渲染为数组的下标,是错误的,渲染的时候是不稳定)

4. react实践声明式的编程
在react中你不会去调用系统API,相反你是去实现一些函数(render,componentDidMount),让react来调用用户的声明代码。这样react的代码可以改变但是用户写的代码不用随着更改。

5. jsx的优势和局限
- jsx需要转义，转义成babel。
- render函数并没有去做渲染的事情,它是一个纯函数,返回一些指令由react对这些指令来对DOM(vDOM)真正的进行操作。react返回的都是react.createElement产生的结果。
- render函数中“{}”里面的东西其实是createElement的某个参数而已。所以它必须是表达式，不能是一个语句(不能使用for,while)。
不要使用push/reverse等数组函数
- 父级传递引用，更改子级state, 父级中的props也会相应的更改(注意)

6. 生命周期
- mount
getDefaultProps
getInitialState
componentWillMount
render
componentDidMount(只在浏览器执行,server端不执行)
- update
componentWillReceiveProps(因父组件想要render这个组件改变引发的update过程)
shouldComponentUpdate
componentWillUpdate
render
componentDidUpdate
- unmount
componentWillUnmount
componentDidUnmount

以render函数为界,render函数之前的state/props都是没有被改变的,render之后得到的state/props才是改变之后的。在v16之后，所有的render之前的生命周期都可能被打断从新执行一次。所以注意,render之前的函数一定要写成纯函数。(如果不是纯函数,有副作用,执行多次的话,得到结果不是预期的)

7. 组件划分
组件不仅仅是有状态和无状态的划分，有些组件什么都不渲染。
> 功能型组件
每隔5s钟发射心跳信息:
```
import React from 'react';
export default class HeartBeat extends React.Component {
  render() {
    return null;
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      fetch('/api/v1/heartbeat');
    }, 5000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
}
```
8. HOC
UI复用采用组件形式解决，逻辑复用? 可以采用HOC形式来做。
HOC实际上是一个函数,最少接受一个组件类，然后返回一个全新的组件。当有些公用的逻辑在多个组件之间可共享则可以采用HOC的形式
```
const HoC = (WrappedComponent) => {
    const WrappingComponent = (props) => (
        <div className="foo">
            <WrappedCompoent {...props} />
        </div>
    );
    return WrappingComponent;
};
```

8. setState
8.1 特点:
- setState不会立刻改变React组件中的state值
直到下一次render函数调用时(或者下次的shouldComponentUpdate返回false时)才得到更新的this.state。
- setState通过引发一次组件的更新过程来引发重新绘制
```
function incrementMultiple() {
  this.setState({count: this.state.count + 1});
  this.setState({count: this.state.count + 1});
  this.setState({count: this.state.count + 1});
}
```
- 多次setState函数调用产生的效果会合并
```
function updateName() {
  this.setState({FirstName: 'Morgan'});
  this.setState({LastName: 'Cheng'});
}
```
这里连续调用了两次this.setState，但是只会引起一次更新生命周期，不是两次，因为React会将多个this.setState 产生的修改放在一个队列中，缓存在一起。觉得差不多类再引起一次更新过程。

8.2 setState 同步更新策略
- 完成回调
setState函数第二个参数允许传入回调函数，在状态更新完毕后进行调用
```
this.setState({load: !this.state.load}, () => console.log('加载完毕'))
```
- 传入计算状态
```
this.setState((preState, props) => {load: preState.load})
```
8.3 setState的同步和非同步行为

官方不保证setState的行为一定是同步执行的，因此希望开发者一律将其视为同步执行。
事实上setState会依照执行情况不同，可能会是同步或者非同步
非同步情况：
* 发生情境：当setState()被呼叫的位置，在React Component 能掌管的范围内
* setState() 的位置在React Component 的Life Cycle或者其延伸Event Handlers中
* 官方预期的执行情景
同步情景
* 发生情景：当setState被呼叫的位置，不在React Component能掌管的范围内
* setSate() 已经脱离了React Component 的Life Cycle或是其延伸的 Event Handlers
例如：在setTimeout(), addEventListener()里面的callBack使用setState

原因:
为什么会有上面的差异，主要原因就是react希望降低re-render的次数，因此在React能够掌握的范围内(onClick等SyntheticEvent)，会打包事件里所有的操作之后再一次性进行更新。这里的react运行机制叫做Update Batching
