1. 将url的hash值取出得到object
'http://www.baidu.com?name=yuank&age=18&size=20'

- 使用match对应的query值
```
var str = 'http://www.baidu.com?name=yuank&age=18&size=20';
str.match(/\w+=\w*/g).reduce((pre, v)=> {
  const arr = v.split('=');
  pre[arr[0]] = arr[1];
  return pre
}, {})
```
- 直接使用replace进行字符串替换
```
var str = 'http://www.baidu.com?name=yuank&age=18&size=20';
var temp = {};
str.replace(/[?&](\w+)=(\w*)/g,(m,g1,g2) => {
  temp[g1] = g2;
})
```

- 总结
上面代码有点问题,\w代表[a-zA-Z0-9_],实际URL可能为任意的参数。所以字符可以为[^=&]。

2. stringify将object转成json形式
```
var obj = {
  name: 'yuank',
  age: 20
}
var str = '';
for(var prop in obj) {
  str += `${prop}=${obj[prop]}&`
}
str.slice(0, -1);
```