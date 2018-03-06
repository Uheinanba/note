### 编写中间件
Koa中间件就是简单的函数，返回一个带有签名(ctx,next)的MiddlewareFunction。当中间件运行时，它必须手动调用next()来运行“下游”中间件。
如果你想要跟踪通过添加X-Response-Time头字段通过Koa传播请求需要时间。
```
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});
```

### 中间件最佳实践
1. 中间件参数
在创建中间件的时，将中间件包装在接受参数的函数中，遵循这个约定是有用的，允许用户扩展功能。即使你的中间件不接受任何参数，这仍然是保持统一的好方法。

```
const logger = (format) => {
    format  = format || ':method ":url"';
    return async (ctx, next) => {
        const str = format
            .replace(':method', ctx.method)
            .replace(':url', ctx.url);
        console.log(str);
        await next();
    }
}
app.use(logger());
app.use(logger(':method :url'));
```

2. 命名中间件
命名中间件是可选的，但是在调试中分配名称很有用
```
function logger(format) {
    return async function logger(ctx, next);
}
```

将多个中间件和koa-compose结合
有时你想要将多个中间件“组合”成单一的中间件，便于重用或导出。可以使用 koa-compose
```
const compose = require('koa-compose');
async function random(ctx, next) {
    if('/random' == ctx.path) {
        ctx.body = Math.floor(Math.random() * 10);
    } else {
        await next();
    }
}
async function backwards(ctx, next) {
  if ('/backwards' == ctx.path) {
    ctx.body = 'sdrawkcab';
  } else {
    await next();
  }
}
const all = compose([random, backwards]);
app.use(all);
```

3. 响应中间件
中间件决定响应请求，并希望绕过下游中间件可以简单的忽略next().通常这将在路由中间件中，但这也可以任意执行。

4. 异步操作
async 和promise来自Koa底层，可以编写非阻塞序列代码。