// https://github.com/DoubleSpout/threadAndPackage
https://juejin.im/post/5a64c22a6fb9a01cb74e7a75
1. 探寻JavaScript的异步设计
- 浏览器是多线程的，常驻线程有:
  * 浏览器GUI渲染线程
  * javascript引擎线程
  * event loop 线程(settimeout,事件触发,ajax)
-  javascript是单线程的
> GUI 渲染进程和javascript引擎进程相互排斥，因为如果两个线程可以同时运行的话，javascript的DOM操作会扰乱渲染线程执行前后的数据的一致性。
- 理解阻塞/非阻塞,同步/异步
*  同步/异步
关注的是消息通信机制,
> 所谓同步就是在发出一个“调用”时，在没有得到结果的之前，该“调用”就不返回，一旦“调用”返回，就得到返回值了。换句话说:是由“调用者”主动等待这个“调用”结果
> 异步则相反，“调用”发出之后，这个调用就直接返回了，所以没有返回结果。换句话说：当一个异步过程调用发出之后，调用者不会立即得到结果。而在“调用”发出后，“被调用者”通过状态，通知来通知调用者，或者通过回调函数处理这个调用。
* 阻塞与非阻塞
阻塞和非阻塞关注的是程序在等待调用结果(消息，返回值)时的状态。
阻塞调用是指调用结果返回之前，当前线程会被挂起。调用线程只有在得到结果之后才返回。非阻塞调用指在不能立即得到结果之前。该调用不会阻塞当前线程。

2. JavaScript 运行原理解析
- javascript Engine
最著名的 V8引擎,用于chrome 和Node.js的底层。简单的示例如下
js {
  Memory Heap: 这是内存分配的地方(堆)
  Call Stack: 代码执行时栈帧的地方(栈)
}
- Runtime 
JS 在浏览器中可以调用浏览器提供的API 例如:setTimeout等并不是由V8提供的。它们是由 浏览器提供的(dom,ajax, setTimeout等)，同样在Node.js 中，可以把 node的各种库提供的API称为Runtime.可以理解为 Chrome 和 node.js都采用相同的V8引擎，但是拥有不同的RunTime。
- call Stack
javascript是一门单线程的语言，意味着它只有一个调用栈，我们一次只能做一件事情。
call stack是一个数据结构记录了我们程序在哪里地方。

3. node.js 设计原理: Reactor(Event Loop)
- Blocking IO(阻塞)
阻塞IO是程序等待IO请求直到结果返回，在等待这段时间程序不会干其他事，就这样一直等着。对于web server来说，必须要处理多个请求的，对于阻塞IO情况，无法处理多个请求。每个请求都会在上一个请求处理完成才能处理。解决方法是启用多线程进行处理。
但是开启多线程处理的代价比较高(内存占用，上下文切换)。
- Non-blocking IO(非阻塞)
 对于非阻塞UI，一般是请求后直接返回，不用等待请求结果的返回。如果没有数据可以返回的话，是直接返回一个预设好的常量标识。
 Non-blocking IO 一般是通过synchronous event demultiplexer来实现。简单来讲就是，对于事件循环的资源会通过demultiplexer(多路分发器)下发给对应的程序去处理，处理好了则把对应事件保存到event queue中等待事件轮询运行。
 程序代码运行下来不会产生阻塞，阻塞的事情交给分发器去做了。

- Reactor Pattern
Nodejs中事件循环是基于event demultiplexer和event queeu, 这两块是Pattern的核心，对于Nodejs事件循环首先声明:
只有一个主线程执行JS代码，我们写的代码就是在该线程执行的，该线程也同是event loop运行的线程。(并不是主线程运行JS代码，然后另外线程同时运行event loop)

- nodejs如何做到IO的异步和非阻塞? 其实在底层IO还是通过线程池来实现的(libuv模块)。线程池是真正执行事件和任务处理的地方。比较耗时的操作：网络IO，文件操作IO以及其他会引起阻塞的操作都会在这里处理。处理完成之后回调事件对应的回调函数
- libuv库，实现了事件循环和线程池等功能。线程池是系统级别的任务处理，也就是说事件实际处理是在更底层系统级完成的，在这一过程中并不是单线程的。处理完成之后，线程池回调用与之绑定的回调函数，这样处理结果又被传回到Node中。

- 浏览器和Node中的event loop区别
* nodejs中的event loop由Libuv提供
* 浏览器中的event loop由浏览器提供
