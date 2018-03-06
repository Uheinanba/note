### try-catch
使用async 方法意味着可以try-catch next
app.use(async (ctx, next) => {
    try{
        await next();
    } catch (err) {
        err.status = err.statusCode || err.status || 500;
        throw err;
    }
})

### 默认错误处理程序
默认错误处理程序本质上是中间件链开始时的一个try-catch。要使用不同的错误处理程序,只需在中间件链的起始处放置另外一个try-catch,并在那里进行处理。
```
app.use(async (ctx, next) => {
    try{
        await next();
    } catch(err) {
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
            message: err.message
        }
    }
})
```

### 错误事件
错误事件侦听器可以用app.on('error')指定，如果未指定错误侦听器，则使用默认错误侦听器。错误侦听器接受所有中间件链返回的错误，如果是一个错误被捕获不再跑出，它将不会传递给错误侦听器。
如果没有指定错误事件侦听器，那么将使用 app.onerror，如果 error.expose 为 true 并且 app.silent 为 false，则简单记录错误。
