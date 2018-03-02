// https://cnodejs.org/topic/5a9108d78d6e16e56bb80882
### 不同的 event loop
讨论 event loop的前提:
* 首先要缺点好上下文，nodejs和浏览器的event loop是两个有明确区分的事物，不能混为一谈。
* 其次，讨论一些js异步代码的执行顺序的时候，要基于node的源码而不是yy。
简单来说：
* nodejs的event是基于libuv，而浏览器的event loop则在html5规范中明确定义
* libuv已经对event loop作出了实现，而html5规范只定义了浏览器中的event loop的模型，具体实现留给来浏览器厂商。