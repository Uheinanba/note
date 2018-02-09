1. mongo主键_id
mongoDB默认会为每个 document生成一个_id属性，作为默认主键，且默认值为ObjectId,可以更改_id的值。但每个document必须拥有_id属性。如果不想使用默认的主键。则需要自己维护主键名和值(eg: userId:201460001)

mongoDB 是以空间换时间和效率，本身不提供关系数据库常见的主键生成策略，事务。因此使用者或者服务器需要有自己的处理逻辑

2. 时间
MongoDB 中的时间类型默认是MongoDate,MongoDate默认是按照UTC(世界标准时间)来存储。例如下面的两种使用方式
```
db.col.insert({'date': new Date(), num: 1})
db.col.insert({'date': new Date().toLocaleString(), num: 2})
db.col.find()
{
    "_id" : ObjectId("539944b14a696442d95eaf08"),
    "date" : ISODate("2014-06-12T06:12:01.500Z"),
    "num" : 1
}
{
    "_id" : ObjectId("539944b14a696442d95eaf09"),
    "date" : "Thu Jun 12 14:12:01 2014",
    "num" : 2
}
```

> 注意：第一条数据存储的是一个Date类型，第二条存储的是String类型。两条数据的时间相差大约8个小时。第一条数据MongoDB是按照UTC时间来存储。

3. MongoDB 中一对多，多对多关系(MongoDB中数据关系的处理)
MongoDB的基本单元是Document(文档)， 通过文档的嵌套来组织，描述数据之间关系。
