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
- 切状态外置，组件不管理自己状态，比较理想化
优势： 整个应用的状态可预测
劣势： 抽象成本高,不必要的数据进入全局,让store变得非常复杂。如果作为组件库提供给第三方的存在,则无法复用。

人群：个体自主权较大
部分内置，让组件自己管理，另外一些由全局store管理，现实的妥协。
优势：土洋结合，容易开发
劣势：部分状态不受控，热替换存在缺陷

redux 作者说 local State is Fine
组件对状态的管理:
```
constuctor(props) {
    super(props);
    this.state = {b:1}
}
render(props) {
    const a = this.state.b = props.c;
    return (<div>{a}</div>);
}
```
渲染的时候b来自组件自己的状态，c来自组件外部的状态。这样的就破坏了render本身的纯洁性。

###  如何结合内外的状态
```
const mapStateToProps = (state: {a}) => {
    return {a}
}
const localState = {b:1};
const mapLocalStateToProps = localState => localState;

const ComponentA = (props) => {
    const {a, b} = props;
    const c = a+ b;
    return (<div> {c} </div>)
}
return connect(mapStateToProps, mapLocalStateToProps)(ComponentA);
```
redux 的问题？

### MVI
1. 理念
- 一切都是事件源
- 使用Reactive的理念构建程序的骨架
- 使用sink定义应用逻辑
- 使用driver隔离有副作用的行为(网络请求,DOM渲染)
2. 全局状态和本地状态
MVI的优势在于提供了一种清晰的处理过程，把组件之外的全局状态和组件内部融合在一起:
```
state$ = xs.combine(
    props,
    localState$
)
```
这样的组件部分可以纯化，并且组件内部逻辑和展示部分距离很近。

### 分形
每个组件对全局部分有依赖,可能要修改外部状态。如果每个组件天然分成对外处理和对内处理。

### Redux的单Store
全局有一个大的State对象用于描述状态：
* 某个reducer修改了state的某个分支
* combineReducer把修改结果合并到state上
* react-redux拿到新的state去更新视图。
reducer在修改数据的时候，是精确知道修改了state上哪些数据,但被combineReducer合并结束之后，就不清楚了,只是知道整个state改变了。
之后还要选出更新的那部分来做视图渲染,不然就有很多无效的状态。所以有reselect这样的方案。

### 合并之后统一reduce
先把这些action全部merge之后在fold，和redux 理念一致
```
const actions = xs.merge(
    addActions$,
    updateActions$,
    deleteActions$
)
const localState$ = actions.fold((state, action) => {
    switch(action.type) {
    case 'addTodo':
        return addTodo(state, action)
    case 'updateTodo':
        return updateTodo(state, action)
    case 'deleteTodo':
        return deleteTodo(state, action)
    }
}, initState)
```

### 先单独reduce再合并
```
// 如果数据没有相关性，可以分别reduce之后在合并
const a$ = actionA$.fold(reducerA, initA);
const b$ = actionB$.fold(reducerB, initB);
const c$ = actionC$.fold(reducerC, initC);
const state$ = xs.combine(a$, b$, c$)
    .map(([a,b,c]) => ({a,b,c}));
// 如果足够简单可以省去action
const state$ = xs.fromEvent($('.btn'), 'click')
    .map(e => e.data);
```
数据来源全局部分和本地部分。本地部分比较简单，没有必要和全局使用同样方式使用action来定义。


### 按照模型分类的数据流
```
// 按照业务模型组合的reducer
const projectModel$ = xs
.combine(addProjectReducer$, editProjectReducer$)
const articleModel$ = xs
.combine(addArticleReducer$, editActicleReducer$)
// 修改整个state的reducer
const state$ = xs
.combine(projectModel$, articleModel$)
```

### state里如何存储数据
- 按照原始数据存储
    试图使用时常常要做转换
- 按照视图形式存储
    * 存储时可能会出现冗余
    * (因为冗余)容易出现不一致
- 如果兼而有之
    * 同步是个大问题

### 数据加工的可选位置
Action -->  [Reducer -> Normalizr(可选)] -> state -> [VM(可选) --> View]

### 可复用的数据和计算过程
```
const list$ = xs.from(arr)
const tree$ = list$.map(listToTree)
list$.subscribe(/* 以列表形式展示 */)
tree$.subscribe(/* 以树的形状展示 */)
```
可以同时具有不同的形态数据管道，只需要控制好它们的转换关系

### 分离对State的读写
对State的读写操作实际上是分离的:
* 通过action负责写入
* 通过模型数据管道组合订阅来读取

在此基础上,可以继续深入:
* 写入操作原子化
* 读取操作响应化
* 与持久存储结合
* 需要控制好时序关系(重要)

### 小结
* 不需要显示定义整个应用的state结构ß
* 
