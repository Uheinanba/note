### JS运算时类型强转问题:
```
1 + null = 1
1 + undefined = NaN
```

ecma加法操作步骤:先对两个值进行ToPrimitive操作
ToPrimitive(null) == 0
ToPrimitive(undefined) == NaN

### {} 用 >= 比较的问题
```
console.log({} == {}); //false
console.log({} > {}); //false
```
等值比较,‘==’在对象比较时候比较的是它们的指针，{}是一个新的对象所以指针是不相等的。

大小比较:会分别执行内部的ToPromitive的操作，{}执行之后的呆该对象的字符串"[object Object]"。
