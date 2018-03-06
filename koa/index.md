### koa
koa是由Express原班人马打造额，致力成为一个更小，更富有表现力，更健壮的Web框架

1. 应用程序
Koa应用程序是一个包含一组中间件函数的对象，它是按照类似堆栈的方式组织和执行的。Koa类似你可能遇到的很多其他中间件系统,然而一个关键的设计点是在其低级中间件层中提供高级的“语法糖”。这提高了互操作性，稳健型，并使书写中间件更加愉快。

这包括诸如内容协商，缓存清理，代理支持和重定向等常见的任务方法。尽管提供了相当多有用的方法Koa任保持了很小的体积。
```
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```
2. 级联
Koa中间件以更传统的方式级联, 洋葱模型

3. 设置
应用程序设置是app实例上的属性，目前支持:
- app.env 默认是 NODE_ENV 或 "development"
- app.proxy 当真正的代理头字段将被信任时
- app.subdomainOffset 对于要忽略的 .subdomains 偏移[2]

### 方法
1. app.listen(...)
Koa应用程序不是Http服务器1对1展现。可以将一个或者多个Koa应用程序安装在一起形成一个具有单个HTTP服务器的更大应用程序

创建并返回HTTP服务器，将给定的参数传递给Server#listen()。
```
const Koa = require('koa');
const app = new Koa();
app.listen(3000);
```
app.listen(3000) 是http.createServer(app.callback()).listen(3000)的语法糖。
意味着可以将同一个应用程序同时作为HTTP和HTTPS多个地址。
```
const http = require('http');
const https = require('https');
const Koa = require('koa');
const app = new Koa();
http.createServer(app.callback()).listen(3000);
https.createServer(app.callback()).listen(3001);
```

2. app.callback()
返回适用于http.createServer() 方法的回调函数来处理请求。你也可以使用此回调函数将Koa应用程序挂载到Connect/Express应用程序中。

3. app.use(function)

4. app.keys = 
设置签名的Cookie密钥
这些被传递给 KeyGrip,你也可以传递自己的KeyGrip实例
```
app.keys = ['im a newer secret', 'i like turtle'];
app.keys = new KeyGrip(['im a newer secret', 'i like turtle'], 'sha256');
```
这些密钥可以倒换，并在使用 {signed: true} 参数签名Cookie时使用
```
ctx.cookies.set('name', 'tobi', { signed: true });
```

5. app.context
app.context 是从其创建的ctx原型，可以通过编辑app.context为ctx添加其他属性。这对于将ctx添加到整个应用程序中使用的属性或者方法非常有效。

例如，从ctx添加对数据库的引用
```
app.context.db = db();

app.use(async ctx => {
  console.log(ctx.db);
});
```

### 错误处理
默认情况下，将所有的错误输出到stderr,除非app.silent为true。当err.status为404或err.expose为true时默认错误处理程序也不会输出错误。要执行自定义错误处理逻辑，如：集中式日志记录，您可以添加一个“error”事件侦听器
```
app.on('error', err => {
    log.error('server error', err);
})
```
如果req/res期间出现错误，并且无法响应到客户端，Context实例任然被传递：
```
app.on('error', (err, ctx) => {
  log.error('server error', err, ctx)
});
```
当发生错误，并且仍然可以响应客户端时，也没有数据被写入sokcet中，Koa将用一个 500"内部服务器错误"进行适当的响应。在任一情况下，为了记录的目的都会发生应用级“错误”。