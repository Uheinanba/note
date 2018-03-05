// https://github.com/ElemeFE/node-interview/tree/master/sections/zh-cn

1. 类型判断
```
undefined == null //  true。
{} == {} // false
{} >= {} // true
1 + null // 0
1 + undefined // NaN
```
2. 作用域

3. 引用传递
4. 内存释放
// https://zhuanlan.zhihu.com/p/25736931
内存泄露的几种情况
- 全局变量
global.a = 12;
- 闭包
```
function out() {
  const bigData = new Buffer(100);
  inner = function() {
    void bigData;
  }
}
```
闭包会引用到父级函数中的变量，如果闭包未释放，就会导致内存泄露。上面的例子是inner直接挂在root上。导致内存泄露(bigData不会释放)
- 事件监听(TODO)
Node的事件监听也可能会出现内存泄露。例如对同一个事件重复监听，忘记移除，将造成内存泄露。这种情况很容易在重复对象上添加事件时出现，所有事件重复监听可能收到警告。
例如：Nodejs中Agent的keepAlive的true,可能造成内存泄露。当Agent keep Alive为true时候，将会复用之前使用过的socket,如果在socket上添加事件监听，忘记清除的话，因为socket复用，导致事件重复监听而产生内存泄露。
- 其他原因
还有些其他原因导致内存泄露。比如：缓存。在使用缓存时候，得清楚缓存对象多少，如果缓存非常多，得做限制最大缓存数量处理。还有就是非常占用CPU的代码也会导致内存泄露，服务器在运行的时候，如果有高CPU的同步代码，因为node.js 是单线程，所以不能处理请求处理，请求堆积导致内存占用过高。