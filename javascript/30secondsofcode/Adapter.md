1. ary
创建一个最多接受n个参数的函数，忽略任何附加参数
效果:

```
const firstTwoMax = ary(Math.max, 2);
[[2, 6, 'a'], [8, 4, 6], [10]].map(x => firstTwoMax(...x)); // [6, 8, 10]
```

```
const ary = (fn, n) => (...arg) => fn(
  arg.slice(0,n)
)
```