### 现代的前端框架
1. 组件化
2. MDV

### 复用
传统编程的模式我们可以:复用一种数据或者是一个函数，但是很难做到复用一种会持续变化的数据。
基于 Reactive programming的库可以提供这样的一种能力,把数据包装成可持续变更,可观测的类型,供后续使用:rxjs,xstream,most.js等。
```
const  a$ = xs.of(1);
const arr$ = xs.from([1,2,3]);
const interval$ = xs.interval(1000);
```
- 可以持续得到每次变更的响应,经过这样的封装的数据，可以视为管道。如果在管道上附加后续操作，可以作用到流过的所有数据。
interval$.filter(num => num%3).map(num => num *2);
1.) 管道是懒执行的,必须在订阅之后才执行。
2.) 管道执行过程可以被共享.
- 可以把若干个管道用不同的方式组合起来,得到新的数据管道。
```
const $priv$ = xs.combine(user$, article$)
    .map(arr => {
        const [user, article] = arr;
        return user.isAdmin || article.creator === user.id
    })
```
当user$或者task$中的数据发生变更时候,priv$都会自动计算最新的结果。

- 更高层次的抽象
```
const data$ = xs.fromPromise(service(params))
    .map(data => ({loading: false, data}))
    .replaceError(error => xs.of({loading: false, error}))
    startWith({
        loading: true,
        error: null
    })
```
这段代码处理了请求过程中 loading,正常数据和异常。最终得到两个结果(请求前,请求之后)。

### 数据来源和变更的抽象
- 初始数据状态的来源
* 应用的默认配置
* HTTP请求
* 本地存储
不管来自哪里，都可以合并到一起。可以去掉些无效数据,得到正常结果
```
const fromInitState$ = xs.of(todo);
const fromLocalStorage$ = xs.of(getTodoFromLS());

const init$ = xs.merge(
    fromInitState$,
    fromLocalStorage$
).filter(todo => !todo).startWidth({});
```
- 状态变更的来源的归纳
* 用户从视图发起的操作
* 来自webSocket的推送信息
* 来自Worker的处理信息
* 来自其他窗体的postMessage调用
不管来自哪里，只要修改的是同样的数据，都可以归纳到一起。
```
const changeFromHTTP$ = xs.fromPromise(getTodo())
    .map(rs => rs.data);
const changeFromDomEvent$ = xs.fromEvent($('.button'), 'click')
    .map(evt => evt.data);
const changeFromWs$ = xs.fromEvent(ws, 'message')
    .map(evt => evt.data);

const changes$ = xs.merge(changeFromHTTP$, changeFromDomEvent$, changeFromWs$)
```
- 对变更结果的消费
```
// 简单的使用
changes$.subscribe(({payload}) => {
    xx.setState({todo: payload})
});
// 类似Redux的使用方式
const changeActions$ = changes$
    .map(todo => ({type: 'updateTodo', payload: todo}))

const todo$ = changeActions$
    .fold((acc, val) => {
        const {payload} = val;
        return {...acc, ...payload}
    }, initState);
```

### 组件的状态管理
整个系统组件化之后，会产生一颗组件树
* 上级组件可以给下级组件设置数据(props)
* 上级组件可以给下级组件设置回调
* 可以在多个层级之间逐级传递

距离较远的组件之间通讯，传递过程很繁琐。因此: 会引入一些全局的转发机制。

### 外置的状态

组件树需要依赖于外部的机制做数据的中转，并且有如下事实
- 转发器在组件树之外
- 部分数据在组件树之外
- 对这部分数据的修改过程在组件树之外
- 修改完数据之后，通知组件树更新

产生如下推论：
- 组件可以通过中转器修改其他组件的状态
- 组件可以通过中转器修改自身的状态
- 组件可以通过中转器修改全局的其他状态

### 两种组件状态管理的思路
蚂群：依赖于强大的主控，个体弱小

