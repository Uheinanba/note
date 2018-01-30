### buffer
在前端，我们只需要做字符串级别的操作，很少接触字节，进制等底层操作。但是在后端，处理文件，网络协议，图片，视频等都是非常常见的。像文件，网络流等操作处理都是二进制的数据，为了让js能够处理二进制的数据，node封装了一个Buffer类。住哟啊用于操作字节，处理二进制数据。
1. buffer基本使用
```
    const buf1 = Buffer.alloc(10, 30);
    console.log(buf1);
    const buf2 = Buffer.from('javascript');
    console.log(buf2);
    console.log(buf2.toString());
```
2. buffer内存分配和性能优化
Buffer是一个典型的javascript与C++来实现,js负责衔接和提供接口。Buffer所占的内存不是V8分配的，是独立于V8堆内存之外的内存。通过C++ 申请内存。 通过Buffer.alloc(size)请求一个 Buffer内存时，Buffer会以8KB为界限判断申请的是大对象还是小对象，小对象存入内存池。大对象直接采用C++层面申请内存。对于一个大对象，申请一个大内存比申请众多小内存快很多。

### fs文件模块
fs文件模块是高阶模块，继承了EventEmitter,stream,path等底层模块，提供了对文件的操作，包括文件的读取，写入，更名，删除，遍历目录，链接POSIX文件系统等操作。与node其他模块不同的是，fs模块所有的操作都提供了异步和同步两个版本
* 对底层POSIX文件系统的封装，对应于操作系统原生文件操作
* 继承Stream文件流fs.createReadStream 和fs.createWriteSteam
* 同步文件操作方法  fs.readFileSync, fs.writeFileSync
* 异步文件操作方法 fs.readFile和fs.writeFile(node.js将文件内容视为一个整体，为其分配缓存区并且一次性将文件内容读／写到缓存区中。当读写大文件时，可能造成缓存区“爆仓”)
* read/write 读/写文件内容是不断将文件中的一小块内容读／写入缓存区，最终从该缓存区读取文件内容。


