### 需要加强对函数式编程的理解

1. ary
对参数进行限制:
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

2. 
- 效果:
```
Promise.resolve([1, 2, 3])
  .then(call('map', x => 2 * x))
  .then(console.log); //[ 2, 4, 6 ]
```
- 实现
* const call = (method, fn) => (res) => res[method](fn)
* const call = (key, ...args) => context => context[key](...args);

3. collectInto
```
const Pall = collectInto(Promise.all.bind(Promise));
let p1 = Promise.resolve(1);
let p2 = Promise.resolve(2);
Pall(p1, p2).then(console.log);
```
const collectInto = (fn) => (...res) => fn(res)

// 正常的Promise是一个array数组形式。
4. 
