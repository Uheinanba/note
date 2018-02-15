// https://cnodejs.org/topic/57d68794cb6f605d360105bf
// https://github.com/creeperyang/blog/issues/26
// https://zhuanlan.zhihu.com/p/30741716
// http://www.zcfy.cc/article/timers-immediates-and-process-nexttick-nodejs-event-loop-part-2-3568.html
// http://www.zcfy.cc/article/event-loop-and-the-big-picture-nodejs-event-loop-part-1-3566.html?t=new

// https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/

- 错误观点:
event loop 在用户代码中的一个单独的线程中运行，有一个主线程,用户的javscript代码在上面运行，另外一个线程运行着event loop。每次异步操作发生时，主线程都会将工作交给事件循环，一旦完成，事件循环线程就会回到主线程执行callback。

- 反应器模式
Node工作在事件驱动的模型中，该模型涉及到事件分离器(Event Demultiplexer)和事件队列(Event Queue)。在Node中,所有的IO请求最终会产生一个完成或者失败的状态，或其他触发动作，这些都被抽象为“事件”。这个抽象如下:
* 事件分离器接受IO请求，并将这些请求代理到相对应的请求处理器。
* 一旦这些IO请求完成(一个文件数据读取完成，就可以使用了),事件分离器会将已注册的回到函数添加到待处理的队列中，这些回调函数称为事件，所处的队列称为事件队列。
* 这些事件会按照它们的排队的顺序依次被执行，直到队列为空。
* 这些事件会按照它们排队的顺序依次执行，直到队列为空
* 如果事件队列不再有事件，或者事件分离器没有任何后续的请求，则完成整个程序。否则将从第一个继续循环下去。

事件循环是单线程模式以及[半无限循环]的，之所以是半无限循环，是因为它实际会在某个时间点退出。从开发者角度来看，就是程序退出的时候。

实际情况的复杂性
* 文件IO复杂性
某些系统(linux)并不支持完全异步的文件访问。
* DNS 复杂性
与文件IO类似,某些DNS功能（dns.lookup)会访问系统配置文件。如/etc/hosts。

所以解决方案是?
线程池：引入线程池是为了支持那些不能被epoll/kqueue/event port/IOCP直接处理的功能。现在我们知道并不是所有的IO都发生在线程池中，node已经尽它所能利用的非阻塞和异步IO来完成部分IO请求，对于那些阻塞或者复杂的IO类型，则使用线程池来完成。


- 什么是event loop
事件循环允许Node.js执行非阻塞IO操作，尽管javascript是但线程的，只要有可能就将操作放在系统内核执行。
大多数的现代内核是多线程的，所有它们可以处理后腰执行的多个操作,当其中一个操作完成时，内核会通知Nodejs，以便将相应的回调添加到轮询队列中最终执行。

- event Loop解释
当nodejs 初始化时，它初始化事件循环，处理提供输入脚本。这可能会使得异步API调用，计划定时器或者调用process.nextTick(),然后开始处理事件循环

每个阶段都有一个执行回调的FIFO队列，当事件循环进入一个给定的阶段。它将执行特定于该阶段的任何操作，然后在该阶段的队列中执行回调，直到队列耗尽或者到达最大数量回调。当队列耗尽或达到回调限制时，事件循环将移至下一阶段，以此类推。

由于这些操作中的任何一个都可以调度更多的操作，并且在轮询阶段处理新的事件被内核排队，所有轮询事件可以在轮询事件处理同时排队。因此长时间运行回调可以使轮询阶段运行时间远远超过计时器的阀值。(TODO)


- 阶段描述
* timers: 这个阶段执行由setTimeout（）和setInterval（）
* IO callback : 执行几乎所有的回调，除了关闭回调，定时器调度的回调和setImmediate（）
* idle,prepare : 只在内部使用
* poll: 检索新的IO事件，节点将在适当的时候阻塞
* check: setImmediate（）回调在这里被调用
* close callbacks: e.g. socket.on('close', ...)

在事件循环的每次运行之间，Nodejs检查是否正在等待任何异步IO或者定时器，如果没有任何异步IO或者定时器，则清除关闭。
