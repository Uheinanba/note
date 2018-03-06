1. 一个简单例子
- server 接收来自客户端的请求，并将客户端请求的地址返回给客户端
- client 向服务器发起请求，并将服务器返回的内容打印到控制台

```
var http = require('http');

// http server 例子
var server = http.createServer(function(serverReq, serverRes){
    var url = serverReq.url;
    serverRes.end( '您访问的地址是：' + url );
});

server.listen(3000);

// http client 例子
var client = http.get('http://127.0.0.1:3000', function(clientRes){
    clientRes.pipe(process.stdout);
});
```
2. 解释
在server端, 
this -> Server http.Server的实例，用来提供服务，处理客户端的请求
req -> IncomingMessage 
http.IncomingMessage的实例。server端用来获取客户端请求相关信息，如request header等。而client端用来获取服务端相关的信息，比如response header
res -> ServerResponse。 http.ServerResponse实例

在Client端
this -> client：http.ClientReques实例，用来向服务端发起请求
req -> IncomingMessage


http.IncomingMessage实例在server,client都出现了。它的作用是：
* 在server端：获取client端 请求发送方的信息，比如请求方法，路径，传递的数据等。
* 在client端: 获取server端发送过来的信息，比如请求方法，路径传递参数等。


3. 关于继承和扩展
http.server 
* 继承net.server
* net.createServer,回调中的socket是一双工的stream接口，也就是说：读取发送方信息，向发送方发送信息都靠它。