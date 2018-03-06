1. 概览
它其实是一个http.Incoming.Message 实例，在服务端，客户端作用略微有差异
* 服务端：获取请求方的相关信息，如request header等
* 客户端：获取响应方返回的相关信息，如statusCode等
服务端的例子:
```
// 下面的 req
var http = require('http');
var server = http.createServer(function(req, res){
    console.log(req.headers);
    res.end('ok');
});
server.listen(3000);
```

客户端的例子:
```
// 下面的res
var http = require('http');
http.get('http://127.0.0.1:3000', function(res){
    console.log(res.statusCode);
});
```
