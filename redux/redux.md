// http://www.redux.org.cn/docs/FAQ.html
// http://cn.redux.js.org/docs/recipes/reducers/BasicReducerStructure.html
// https://egghead.io/browse/frameworks/react
### createStore
```
createStore(reducer, initState)
```
这里initState作为第二个参数的作用，主要用于初始化哪些在其他地方有持久化存储的state.例如浏览器的localStorage.

###combineReducers
combineReducers 目前只能处理普通的javascript对象，如果把immuatable Map对象作为顶层state树的程序，则无法使用到combineReducers管理应用状态。这里需要使用 redux-immutable工具


