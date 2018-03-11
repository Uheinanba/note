### 基础概念
javascript Engine和javascript Runtime
为了让js运行起来，要完成两部分工作
- 编译并执行js代码，完成内存分配，垃圾回收等。
- 为js提供一些对象或者机制，使它能够和外界进行交互。
第一部分是Engine第二部分是Runtime。
> 举例: Chrome和Node都使用了V8 的Engine: V8实现并提供了ECMAScript标准中所有数据类型，操作符对象和方法(没有DOM)
但它们的Runtime并不一样：Chrome提供了Window,Dom而Node则是Require,process等。

事件驱动的系统本身通过主线程不断循环处理事件队列来实现。实际上，事件驱动的系统Watcher的概念。比如创建定时器，就创建一个计时器的watcher，主线程会调用这个watcher.检查事件队列中计时器事件是否存在。

### 关于JS语言
在Js运行时候，JS engine会创建和维护相应的堆和战，同时通过JS RunTime提供的一系列的API(setTimeour,XMLHtpRequest等)来完成各种各样的任务。
js是一种单线程的编程语言，只有一个调用栈，决定了它在同一时间只能做同一件事情。
在Js运行过程中，真正负责执行JS代码只能有一个线程，称为主线程。各种任务都会用排队方式同步执行。问题是：如果你在执行一段非常耗时同步代码，浏览器没有办法同时渲染GUI，导致界面失去响应。被阻塞了。
然而JS又是一个非阻塞，异步，并发的编程语言。涉及到事件循环机制了

### Event Loop
事件循环是让JS既做到单线程，又绝对不会阻塞的核心机制，也是Js并发模型的基础，用来协调各种事件，用户交互脚本执行，UI渲染，网络请求的一种机制

Event Loop分为两种，一种是Browsing Context还有就是在Worker中。
1. Browsing Context是指一种将Document展现给用户的环境，例如浏览器中的Tab，Window和iframe等，通常用来包含Browsing Context
2. Worker指的是独立于UI脚本，可在后台执行脚本的API。常用来后来做一些计算密集型任务

本文介绍的是Browsing Context中的Event Loop，相比Worker中的Event Loop它更加复杂
另外Event Loop并不是在ECMAScript中定义的，而是在HTML定义中定义的。


###  Event Loop中任务队列
在执行和协调各种任务时，Event Loop 会维护自己的任务队列。任务队列分为Task Queue 和MicroTask Queue。
1. task Queue
一个Event Loop会有一个或多个Task Queue，这是一个先进先出的有序列表，存放来自不同的Task Source(任务源) 的Task
- dom 操作
- 用户交互
- 网络请求
- History Api 操作
2. Microtask Queue
Microtask Queue 和task Queue 类似，也是一个有序列表，不同在于一个EventLoop只有一个Microtask queue。
- promise
- mutationObserver

 ### js Runtime 运行机制
步骤如下:
1. 主线程不断循环
2. 对于同步任务，创建上下文，按照顺序进入执行栈
3. 异步任务
 - 和步骤2相同，同步执行这段代码
 - 将相应Task(或microTask)添加到Event Loop任务队列中
 - 由其他线程来执行具体的异步操作
4. 主线程执行当前执行栈中所有任务，就会去读取Event Loop任务队列，取出并执行任务。
5. 重复上面步骤

### event Loop处理模型
1. 执行Task,从Task Queue取出最老一个Task并执行，如果没有Task直接跳过
2. 执行MicroTask,遍历MicroTask Queue并执行所有的MicroTask.
3. 进入Update then rendering(更新渲染)阶段：
  - 触发各种事件：resize，scroll, Media Queries、CSS Animations、Fullscreen API。
  - 执行animation frame callbacks,，window.requestAnimationFrame 就在这里。
  - 更新 intersection observations，也就是 Intersection Observer API（可用于图片懒加载）。更新渲染和 UI，将最终结果提交到界面上
至此，Event Loop 的一次循环结束


#### 测试
```
// html
<div id="outer">
    <div id="inner"></div>
</div>
```
// css
```
#outer {
    width: 200px;
    height: 200px;
    background-color: red;

    display: flex;
    justify-content: center;
    align-items: center;
}

#inner {
    width: 100px;
    height: 100px;
    background-color: yellow;
}

```

```
// js
const inner = document.getElementById("inner");
const outer = document.getElementById("outer");

// 监听 outer 的属性变化。
new MutationObserver(() => console.log("mutate outer"))
    .observe(outer, { attributes: true });

// 处理 click 事件。
function onClick()
{
    console.log("click");
    setTimeout(() => console.log("timeout"), 0);
    Promise.resolve().then(() => console.log("promise"));
    outer.setAttribute("data-mutation", Math.random());
}

// 监听 click 事件。
inner.addEventListener("click", onClick);
outer.addEventListener("click", onClick);
```

1. 手动点击黄色区块触发的话。输出为:
click,promise,mutate,click,promise,mutate,timeout,timeout
2. 如果是使用代码调用触发 inner.click();
输出为：click,click,promise,mutate,promise,timeout,timeout

 