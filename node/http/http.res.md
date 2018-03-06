### 概览
一个web服务程序，接受来自客户端的http请求后，向客户端返回正确的响应内容，这就是res的职责。
返回内容包括： 状态码/状态描述信息，响应头部，响应主体
```
var http = require('http');
var server = http.createServer(function(req, res){
    res.send('ok');
});
server.listen(3000);
```
### 设置状态代码，状态描述信息
res提供了 res.writeHead()、res.statusCode/res.statusMessage 来实现这个目的。
如果想设置200/ok,可以
```
res.writeHead(200, 'ok');
```
也可以
```
res.statusCode = 200;
res.statusMessage = 'ok';
```
两者差不多，差异在于
* res.writeHead()可以提供额外的功能，比如设置响应 头部
* 当响应头部发送出去后,res.statusCode/res.statusMessage 会被设置成已发送出去的 状态代码/状态描述信息.


### 设置响应头部
res提供了res.writeHead(), res.setHeader()来实现响应头部的设置
```
// 方法一
res.writeHead(200, 'ok', {
    'Content-type': 'text-plain'
})
// 方法二
res.setHeader('Content-Type', 'text-plain');
```
两者的差异在哪里呢?
- res.writeHead()不单单是设置header
- 已经通过setHeader设置header，当通过res.writeHead() 设置同名header，res.writeHead() 的设置会覆盖之前的设置。