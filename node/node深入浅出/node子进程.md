// https://github.com/ElemeFE/node-interview/blob/master/sections/zh-cn/process.md

https://github.com/chyingp/nodejs-learning-guide

https://www.youtube.com/watch?v=9o8B3L0-d9c

https://vimsky.com/article/2535.html
https://segmentfault.com/a/1190000005004946
### 进程和线程

一个任务实际就是一个进程(Process),一个进程内同时要干多件事(运行多个子任务)，这些子任务就是线程(Thread).是程序执行的最小单位，一个进程可以有一个或者多个线程，各个线程之间可以共享进程的内存空间。
由于每个进程最少干一件事，所以一个进程最少有一个线程。进程也可以有多个线程，多个线程可以“同时执行”，多个线程的执行方式和多进程是一样的，也是由操作系统在多个线程之间快速的切换，让每个线程都短暂的交替运行，看起来就像同时执行一样。但是线程间的上下文切换比进程的上下文切换开销小的多，也快很多。

###  Process
1. 操作系统的进程
操作系统的进程是服务端一个基础的概念，进程是一个应用程序的实例，同一个应用程序可以起多个实例(进程)。并且进程是一个系统资源的集合，包括内存，cpu等。同是进程也是系统各个资源使用的标识。
>  操作系统为每个进程都划分了单独的虚拟内存空间，以避免跨进程的内存注入问题。
2. Node的Process对象(代表当前的进程对象)
Node的Process对象是一堆信息与操作的集合。由于process很多功能是在C++中binding的原因,process上混合了很多功能
* process.argv
```
[ '/Users/yuankun/.nvm/versions/node/v8.0.0/bin/node',
  '/Users/yuankun/heimanba/github/note/node/code/process/parent.js',
  '--parms' ]
```
* process.stdout(stdin);
- console.log 等于:
console.log === process.stdout.write
- 将当前文件打印到屏幕上:
fs.createReadStream(__filename).pipe(process.stdout);


### child_proces

```
if (process.argv[2] === "child") {
  console.log("i am inside the child", process.argv);
} else {
  var child = spawn(process.execPath, [__filename, "child"], {
    stdio: "inherit"
  });
  // child.stdout.pipe(process.stdout);
  /* child.stdout.on("data", function(data) {
    console.log("from child", data.toString());
  }); */
}
```
