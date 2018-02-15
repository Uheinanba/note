## egghead.io  redux 视频(by Dan Abramov)
// https://www.youtube.com/watch?v=76FRrbY18Bs&index=8&list=PLb0IAmt7-GS3fZ46IGFirdqKTIxlws7e0

1. 简化箭头函数
```
 export function addTodo(text) => {
    return {
     type: 'ADD_TODO',
     text
    }
 }
 // 变成
 export const addTodo = text => ({
    type: 'ADD_TODO',
    text
 });
```

2. 提供init state
createStore函数参数如下createStore(reducer, [preloadedState], enhancer);
* reducer(Function)接收两个参数，分别是当前state树和要处理action,返回新的state 树。
* [preloadedState](any)初始时的state.在同构应用中，可以决定是否把服务端传过来的state水合后传给它，或者从之前保存的用户会话中恢复一个传给它。
* enhancer(Function): Store enhancer 是一个组合Store crator的高阶函数。

```
const store = createStore(
  reducer,
  loadState()
)
store.subscribe(() => {
  saveState(store.getState());
});
```
注意: 
- store.subscribe每次事件触发时候都会保存到localstorage,这里可以使用throttle进行优化。
- action中Id,不要使用自增的id，否则每次刷新时候都是从0开始。最好使用'node-uuid'生成唯一Id。
