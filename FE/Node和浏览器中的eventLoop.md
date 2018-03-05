// https://cnodejs.org/topic/5a9108d78d6e16e56bb80882
### 不同的 event loop
讨论 event loop的前提:
- 首先要缺点好上下文，nodejs和浏览器的event loop是两个有明确区分的事物，不能混为一谈。
- 其次，讨论一些js异步代码的执行顺序的时候，要基于node的源码而不是yy。
简单来说：
- nodejs的event是基于libuv，而浏览器的event loop则在html5规范中明确定义
- libuv已经对event loop作出了实现，而html5规范只定义了浏览器中的event loop的模型，具体实现留给来浏览器厂商。

### event loop 的6个阶段
nodejs的event loop分为6个阶段，每个阶段的作用如下(process.nextTick()在6个阶段结束的时候都会执行)
- timers: 执行setTimeout()和setInterval()到期的callback
timer阶段其实使用最小堆，而不是队列来保存所有元素，(因为timeout的callback按照超时时间顺序来调用，并不是先进先出的队列逻辑)，然后循环取出到期callback执行
- IOcallback: 
一些应该在上轮循环pool阶段执行的callback，因为某些原因不能执行，就会被延迟到这轮循环的IOcallback执行，换句话说这个阶段执行的的callback是上轮存留的。
- idle,prepare: 仅内部使用
- poll:最重要阶段，执行IOcallback，适当条件下阻塞这个阶段
poll阶段的任务就是阻塞等待监听的事件来临，然后执行对应的callback,其中阻塞是带有超时时间的，以下几种情况会使得超时时间为0:
* uv_run处于UV_RUN_NOWAIT模式下
* uv_stop()被调用
* 没有活跃的handles和request
* 有活跃的idle handles
* 有等待关闭的handles 如果上述都不符合，则超时时间为距离现在最近的timer；如果没有timer则poll阶段会一直阻塞下去
- check: 执行setImmediate
- close callback: 执行close事件的callback

```
   ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<─────┤  connections, │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```
event loop每次循环时都需要取出上述的阶段，每个阶段都有自己的callback队列，每当进入某个阶段，都会从所属的队列中取出callback执行，当队列为空或者被执行的callback的数量达到系统最大数量时，进入下一阶段。这6个阶段执行完毕称为一轮循环。

### process.nextTick在哪里
process.nextTick不属于上面任何一个阶段，在每个阶段结束时候都会运行