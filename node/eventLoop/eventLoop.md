// https://cnodejs.org/topic/57d68794cb6f605d360105bf
// https://github.com/creeperyang/blog/issues/26
// https://zhuanlan.zhihu.com/p/30741716
// http://www.zcfy.cc/article/timers-immediates-and-process-nexttick-nodejs-event-loop-part-2-3568.html
// http://www.zcfy.cc/article/event-loop-and-the-big-picture-nodejs-event-loop-part-1-3566.html?t=new

- 错误观点:
event loop 在用户代码中的一个单独的线程中运行，有一个主线程,用户的javscript代码在上面运行，另外一个线程运行着event loop。每次异步操作发生时，主线程都会将工作交给事件循环，一旦完成，事件循环线程就会回到主线程执行callback。

- 什么是event loop
事件循环允许Node.js执行非阻塞IO操作，尽管javascript是但线程的，只要有可能就将操作放在系统内核执行。
大多数的现代内核是多线程的，所有它们可以处理后腰执行的多个操作,当其中一个操作完成时，内核会通知Nodejs，以便将相应的回调添加到轮询队列中最终执行。

- event Loop解释
当nodejs 初始化时，它初始化事件循环，处理提供输入脚本。这可能辉使得异步API调用，计划定时器或者调用process.nextTick(),然后开始处理事件循环

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
