### 基本操作
- 显示当前正在使用数据库 > db
默认数据库为'test'
- 显示所有数据库 > show dbs 
- 切换数据库 > use <database>

### curd
1. 插入文档(如果集合不存在，那么插入操作会创建集合)
- db.collection.insertOne() 
    返回一个结果文档: 
    ```
    {
        "acknowledged" : true,
        "insertedId" : ObjectId("5a729c1b05657c00c5746faa") // 插入文档的'_id'字段
    }
    ```
- db.collection.insertMany()
    返回一个结果文档，文档包含了每一个插入文档的'_id'字段
    ```
    {
       "acknowledged" : true,
	    "insertedId" : [
            ObjectId("5a729c1b05657c00c5746faa"),
            ObjectId("5a729c1b05657c00c57jiojf ")
        ]
   }
    ```
- db.collection.insert(),向集合插入一个或者多个文档
    插入单个对象,返回一个包含状态信息的WriteResult对象
    ```
        WriteResult({"nInserted": 1})
    ```
    插入多个对象返回文档对象BulkWriteResult对象
    ```
    BulkWriteResult({
        "writeErrors" : [ ],
        "writeConcernErrors" : [ ],
        "nInserted" : 3,
        "nUpserted" : 0,
        "nMatched" : 0,
        "nModified" : 0,
        "nRemoved" : 0,
        "upserted" : [ ]
        })
    ```

2. 查询方法
db.collection.find(<query filter>, <projection>)
- 指定等于条件
  查询从user集合中检索status字段值为“A“的所有文档
  ```
    db.users.find({status:'A'})
  ```
- 使用查询操作符指定条件
  查询test集合中检索name字段值为'yuank'或者'dq'的所有文档
  ```
    db.test.find({name: {$in: ['yuank', 'dq']}})
  ```
  尽管可以使用$or操作符表示这个查询，但是在相同字段执行等于检查时，建议使用$in而不是$or。
- 指定 AND 条件
  复合查询可以在集合文档的多个字段上指定条件。隐含的，一个逻辑的AND连接词会连接复合查询的字句。使得查询选出集合中匹配所有条件的文档。
  ```
   db.users.find({
       $or: [{status: 'A'},{age: {$lt: 30}}]
   })
  ```
- 嵌套文档字段的查询
    db.users.find({ favorites: { artist: "Picasso", food: "pizza" } })
    db.users.find({ 'favorites.artist': 'Picasso'
- 指定数组元素的多个查询条件
    查询 finished数组，最少包含大于($gt)15并且小于($lt)20的元素文档。
    db.users.find({finished: {$elemMatch: {$gt: 15, $lt: 20}}})

3. 更新方法
- db.collection.updateOne()
```
    db.test.updateOne({'name':'yuank'}, {$set: {age:23}, $currentDate: {lastModified: true}})
```
使用$set操作符更新字段, 使用$currentDate操作lastModified 值到当前的日期。
- db.collection.updateMany(), 更新多个文档
- db.collection.update(), 如果需要更新多个文档,最后一个参数设置multi: true
```
    db.users.update(
   { "favorites.artist": "Pisanello" },
   {
     $set: { "favorites.food": "pizza", type: 0,  },
     $currentDate: { lastModified: true }
   },
   { multi: true }
)
```
