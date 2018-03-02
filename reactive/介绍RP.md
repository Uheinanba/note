// 文章链接: https://github.com/benjycui/introrx-chinese-edition
1. 什么是RP
- RP是使用异步数据流进行编程
EventBus或者Click events本质上就是异步事件流，你可以监听并处理这些事情.RP的思路大概如下:你可以用包括Click和Hover事件在内的任何东西创建Data Stream。任何东西都可以是Stream：变量,用户输入,属性,Cache,数据结构等。举个例子：想象下你的微博feed就像是Click events那样的Data Stream，你就可以监听它并相应作出响应。

在这个基础上,还可以Combine,create,filter这些Stream.这就是函数式魔法的用武之地。Stream能接受一个甚至多个Stream作为输入。你可以merge多个Stream，也可以从一个Stream中filter出你感兴趣的Events生成一个新的Stream，还可以把一个Stream中的数据map到一个新的Stream中。

-  Stream就是一个按照时间排序的Events序列，它可以emit三种不同的Events：(某种类型的)的Value，error或者“complete”的信号。
通过分别为Value，Error，Complete定义事件处理函数，我们将会异步的捕获这些Events，有时可以忽略Error和Complete只需要定义Value的事件处理函数就行。监听一个Stream称为订阅(Subscribing),而我们订阅的函数就是观察者(Observer),Stream则是被观察(Observeble),其实就是观察者模式。
图示
```
--a---b-c---d-X--|->
```
a,b,c,d代表发送的值，
X 是错误
| 代表complete
-->是timeline
2. 为什么要使用RP
RP提高了代码抽象层级，所以你可以只关注定义了业务逻辑的哪些相互依赖的事件，而非纠缠大量的实现细节。PR的代码往往更佳简明。
特别的现在开发有大量的Data events相关的UI events的高互动性Webapps,mobile apps的时候，RP优势更加明显。
现在的APP有大量的各种各样的时时Events，以给用户提供一个交互较高的体验，我们需要工具应对这个变化。RP就是一个答案。

3. RP方式思考的例子

- 获取github数据的例子
```
var refreshButton = document.querySelector('.refresh');
var refreshClickStream$ = Rx.Observable.fromEvent(refreshButton, 'click');

var responseStream = requestStream
  .flatMap(function(requestUrl) {
    return Rx.Observable.fromPromise($.getJSON(requestUrl));
  });

responseStream.subscribe(function(response) {
  // render `response` to the DOM however you wish
});

```

- 当按钮时候进行刷新时候处理
* 可以对两个流进行合并
```
var requestOnRefreshStream = refreshClickStream
  .map(function() {
    var randomOffset = Math.floor(Math.random()*500);
    return 'https://api.github.com/users?since=' + randomOffset;
  });

var startupRequestStream = Rx.Observable.of('https://api.github.com/users');

var requestStream = Rx.Observable.merge(
  requestOnRefreshStream, startupRequestStream
);
```
* 但是其实一开始执行的是一个静态的流，有个干净的可选方案
```
var requestStream = refreshClickStream
  .map(function() {
    var randomOffset = Math.floor(Math.random()*500);
    return 'https://api.github.com/users?since=' + randomOffset;
  })
  .startWith('https://api.github.com/users');
```
startWith(x)输出的Stream一开始都是x,但是不够DRY(API的URL重复了), 改进方式是移除最后的startWith，并在一开始时候“emulate”(模拟)一次Click。
```
var requestStream = refreshClickStream.startWith('startup click')
  .map(function() {
    var randomOffset = Math.floor(Math.random()*500);
    return 'https://api.github.com/users?since=' + randomOffset;
  });
```

- 点击刷新的时候立即显示空的数据
```
var suggestion1Stream = responseStream
    .map((listUsers) => {
        return listUsers[Math.floor(Math.random()*listUsers.length)];
    })
    .merge(
        refreshClickStream.map(() => null)
    )
    .startWith(null);
```