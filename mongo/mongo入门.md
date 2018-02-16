1. 查找
db.collection.find().count()
db.collection.find().skip().limit().sort();

2. 更新
- 普通更新
db.collection.update({x:1}, {x:999});
- 部分更新数据使用$set关键字
db.collection.update({x:1}, {$set:{z:200}});
-  更新不存在的数据(假设数据不存在，则进行插入操作),使用第三个参数:true
db.imooc_collection.update({x:101},{y:999}, true)
- 更新多条数据
假设{c:1}的数据有多条，使用db.imooc_collection.update({c:1},{c:2})
只能更新一条数据，mongo这样设计是为了防止误操作。
db.imooc_collection.update({c:1},{$set:{c:2}}, false,true)

3. 删除
和查询操作不同的是:删除操作不允许不传递参数,如果不传参数则会报错。
db.imooc_collection.remove({c:2})
