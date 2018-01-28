###  概念
nodejs提供了很多种流对象，例如: http请求,process.stdout都是流的实例。流是可读，可写的或者可读写的。所有的流都是EventEmitter的实例

###  了解流
数据流示处理系统缓存的一种方式，操作系统采用数据块(chunk)的方式读取数据，每收到一次数据，就存入缓存。Node应用程序有两种缓存的处理方式，
- 是等到所有的数据接收完毕，一次性从缓存中读取，就是传统的读取文件形式(遇到大文件容易使内存爆仓)
- 采用“数据流”的方式，收到一块数据，则读取一块，即在数据没有接收完成时，就开始处理它

1. Node中有四种基本流类型
* Readable 可读的流, fs.createReadStream()
* Writable 可写的流, fs.createWriteStream()
* Duplex 可读写的流 net.Socket
*  Transform  在读写过程中可以修改和变换数据的Duplex流 (zlib.createDeflate())

2. 所有的Stream对象都是EventEmitter的实例
常用事件有：
* data 当有数据可读时触发
* end 没有更多的数据可读时触发
* error 在接收和写入过程中发生错误时触发
* finish 所有数据已被写入到底层系统时触发

### 可读流
1. 常用的事件
  *  readable: 在数据块可以从流中读取的时候发出。它对应的处理器没有参数，可以在处理器里掉哟过read([size])犯法读取数据
  * data: 有数据可读时发出。它对应的处理器有一个参数，代表数据。
  * end:  当数据被读完时发出。对应的处理器没有参数
  * close: 当顶层的资源，如文件，已关闭时发出。不是所有的readable流都会发出这个事件，对应的处理器没有参数
  * error:  当在接收数据中出现错误时发出。对应的处理器参数是error的实例。它的message属性描述了错误的原因，statck熟悉保存流发生错误时的堆栈信息。
2. 方法，用于读取或者操作流
 * read([size]):该方法可以接收一个整体作为参数，表示所要读取数据的数量，然后会返回该数量的数据。如果读取不到足够数量的数据，返回null.如果不提供这个参数，默认返回系统缓存中的所有数据。
 * setEncoding(encoding): 给流设置一个编码格式，用于解码读到的数据。调用此方法之后，read([size]方法返回String对象。
 * pause(): 暂停可读流，不再发出data事件。
 * resume(): 恢复可读流，继续发出data事件。
 * pipe(destination, [options]): 绑定一个Writable到readable上，可以读写流自动切换到flowing模式并将所有数据传给绑定的writable。数据流将自动管理。这样即时是可读流较快，目标可写流也不会超负荷
 * unpipe([destination]):该方法移除pipe方法指定的数据流目的地。如果没有参数，则移除所有的pipe方法目的地。如果有参数，则移除该参数制定的目的地。如果没有匹配参数的目的地，则不会产生任何效果。

### 可写流
write方法用于向“可写数据流”写入数据。它接收两个参数，一个是写入的内容，可以是字符串，也可以是一个stream对象(比如可读数据流)或者buffer对象(表示二进制数据)，另外一个是写入完成后的回调函数，它是可选的，write方法返回一个bool值，表示本次数据是否处理完成。
1. 常用事件
* drain: writable.write(chunk)返回false 之后，当缓存数据全部写入完成，可以继续写入时候，会触发drain事件
* finish: 调用end方法时，所有缓存的数据释放，触发finish事件
* pipe 可写数据流调用pipe方法，将数据流导向写入的目的地时触发该事件
* unpipe 可读数据流调用unpipe方法，将可写数据流移出写入目的地时，触发该事件
* error 如果写入数据或者pipe数据发生错误时候，触发该事件
2. 常用方法
* write() 用于向‘可写数据流’写入数据
* cork(), uncork()  cork方法可以强制等待写入数据进入缓存。当调用uncork方法或end方法时，缓存的数据辉吐出。
* setDefaultEncoding() 用于写入的数据编码成新的格式，他返回一个bool值，表示编码是否成功
* end() 用于终止"可写数据流"。

### 管道流
管道提供到一个输出流到输入流的机制。通常我们用于一个流中获取数据并将数据传递到另外一个流中。通常用于大文件的传输复制。
### 链式流
链式是通过链接输出流到另外一个流,并创建多个流操作链的机制。链式一般用于管道操作。
```
const fs = require('fs');
const zlib = require('zlib');
fs.createReadStream('/README.md')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('README.md.gz'))
console.log('压缩完成');
```
