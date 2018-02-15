db.collection.find(<query filter>, <projection>)


1. 查询符合条件中,只返回name,status 以及默认的_id字段
db.users.find( { status: "A" }, { name: 1, status: 1 } )
2. 返回嵌套文档中指定的字段，使用 dot notation(点)返回嵌入文档中特定字段
db.users.find( { status: "A" }, { "favorites.food": 1 } )
3. 排除嵌入文档中特定字段
4. 使用$elemMatch操作符作为数组元素指定复合条件，以查询数组中最少一个元素满足所有指定条件的文档。(用于操作数组)
```
db.users.find( { finished: { $elemMatch: { $gt: 15, $lt: 20 } } } )
```
5. 同时满足
```
db.users.find( { finished: { $gt: 15, $lt: 20 } } )
```




### projection: 可选，使用投影操作指定返回键。查询时返回文档中所有的键值.
* 1或者true在返回文档中包含字段
* 0或false 排除字段

1. Dot Notation
mongoDb 使用点符号来访问数字的元素并访问嵌入文档的字段。

2. 映射返回数组特定的数组元
对于包含数组的字段, mongoDB提供了下面映射操作符 $elemMatch, $slice, 以及 $。
$slice映射操作符来返回数组中的最后的元素。
$elemMatch, $slice, 以及 $是用来指定返回数组中包含映射元素的唯一方式。不能使用{'rating.0':1}映射到数组第一个元素。

