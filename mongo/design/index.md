// https://jelon.top/posts/mongodb-blog-design/

### 基本模型
1. one-to-few (一对很少)
针对个人需要保存多个地址进行建模的场景在使用内嵌文档是非常合适。
```
{
    name: 'yuank',
    ssn: '123-343-4556',
    addresses: [
        {street: '123 Sesame', city: 'Anytown'},
        {street: '123 Avenue', city: 'New York'}
    ]
}
```
这种设计具有内嵌文档设计的所有优缺点，最主要的优点就是不需要单独执行一条语句去获取内嵌的内容。最主要的缺点是无法把这些内嵌文档当作单独的实体去访问。

例如：如果是对一个任务跟踪系统进行建模，每个用户将会被分配到若干个任务。内嵌的这些任务到用户文档在遇到“查询昨天的所有任务”这样的问题时候将会非常困难。

2. one-to-many
以产品零件订货系统为例。每个商品有数百个可替换的零件，但是不会超过数千个。
这个用例非常适合使用简洁引用--将零件的objectid作为数组存放在商品的文档中
```
// 零件
parts: {
    _id: objectID('AAA'),
    name: '#4 grommet',
    qty: 94
}
// 产品
products: {
    name: 'left hand smoke',
    manufacturer: 'Acme Corp',
    catalog_number: 1234,
    parts: [
        objectID('AAA'),
        objectID('BBB')
        objectID('CCC')
    ]
}
```
在特定产品中获取所有的零件，需要一个应用级别的join
为了能快速的执行查询，必须确保products.catalog_number有索引。当然由于零件的parts._id一定是有索引的，索引这也会很高效。
这种引用的方式是对内嵌优缺点的补充。每个零件是一个单独的文档，可以很容易的独立去搜索和更新她们。需要一条单独的语句去获取零件的具体是使用这种建模方式需要考虑的一个问题
这种建模方式的零件部分可以被多个产品使用，所以在多对多时不需要一张单独的连接表。
3. one-to-Squillions(一对非常多)
我们用一个收集各种机器日志的例子来讨论一对多的问题。由于每个mongodb的文档有16 的大小限制。所以即使你是存储ObjectID 也是不够的。我们可以使用非常经典的处理方法“父级引用”---用一个文档存储主机，再每个日志文档中保存这个主机的objectID.
``
hosts: {
    _id: ObjectID('AAAB'),
    name: 'goofy.example.com',
    ipaddr: '127.6.6.6'
}
logmsg: {
    time: IOSDate(2014-03-28),
    message: 'cpu is on fire',
    host: objectID('AAAB')
}
``
以下是和第二个方案稍微不同的应用级别的join用来查找一套主机最近的 5000条日志信息
```
host = db.hosts.findOne({ipaddr: '127.6.6.6'});
last_5k_msg = db.logmsg.find({host:host._id}).sort({time: -1}).limit(5000).toArray();
```

基于以上的因素来决定采用以下三种建模方式
一对少并不需要单独访问内嵌内容的情况下可以使用内嵌多的一方。
一对多且多的一段内容因为各种理由需要单独存在的情况可以通过数组的方式引用多的一方。(引用保存在‘一’端)
一对非常多的情况下，请将一的那端引用嵌入到多的一端对象中。(引用保存在‘多’端)

### 面向关联和反范式化
我们知道mongo的三种基本的设计方案:内嵌,子引用,父引用。同时说明了在选择方案时需要考虑的两个关键因素。
* 一对多中的多是否需要一个单独的实体
* 这个关系集合中的规模是一对很少，很多还是非常多。

1. 双向关联
 如果想让你的设计更酷，可以让饮用的“one”端和"many"端同时保存对方的引用。上面的零件系统为例子
```
// 零件
parts: {
    _id: objectID('AAA'),
    name: '#4 grommet',
    qty: 94,
    owner: objectID('AAF1'),
}
// 产品
products: {
    _id: objectID('AAF1'),
    name: 'left hand smoke',
    manufacturer: 'Acme Corp',
    catalog_number: 1234,
    parts: [
        objectID('AAA'),
        objectID('BBB')
        objectID('CCC')
    ]
}
```
这个方案具有所有的一对多方案的优缺点，但是通过添加所有的引用关系，在 task文档对象中添加额外的“owner”引用可以很快找到某个parts的所有者，但是如果想一个parts分配给其他 products就需要更新引用中的parts和products两个对象。

2. 在一对多关系中应用反范式
在你的设计中加入反范式,可以使你避免应用层级别的join读取，当然，代价也是会让你的更新是需要操作更多的数据。
在一个读写比率高的多的系统中，反范式化是有意义的。如果经常需要很高效的读取冗余数据，但是几乎不去变更它的化，那么付出更新上的代价还是非常值得。更新频率越高，这种设计方案带来的好处越少。


### 结论

谨记
- 优先考虑内嵌，除非有什么迫不得已的原因
- 需要单独访问一个对象，那这个对象就不适合被内嵌到其他的对象中。
- 数字不应该无限制增长，如果many端有数百个文档对象就不要去内嵌她们可以采用ObjectID方案：如果有数千个文档对象，就不要内嵌ObjectID数组，该采取哪些方案取决于数组大小
- 不要害怕应用层级别的join，如果索引建的正确并且通过投射条件限制返回的结果，那么应用层级别的join并不会比关系数据库中join开销大多少

