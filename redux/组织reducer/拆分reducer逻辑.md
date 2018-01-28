1.  对于任何一个有意义的应用来说，将所有的更新逻辑放在单一的reducer函数中，会让程序变的不可维护。虽然说对于一个函数应该有多长没有准确的规定，但是一般来说。函数应该比较短，而且只做一件特定的事。因此，把很长的，同时负责很多事的代码拆分成容易理解的小片段是很好编程方式

2. 因为redux reducer也是一个函数，上面的概念同时适用。可以将reducer中的一些逻辑拆分出去。然后在父函数中调用这个新的函数
这些新的函数通常分三类
- 一些小的工具函数，包含一些可重用的逻辑片段
- 用于处理特定情况的函数更新的函数,参数中除了(state,action)之外还包括其他参数
- 处理给定的state切片的所有更新的函数，参数格式通常为(state, action)

为了清楚可见，这些术语将用于区分不同类型的功能和不同的实例
* reducer: 任何符合(state, action) => newState格式的函数。(即:可以用作array,reducer参数的任何函数)
*  root reducer: 通常作为createStore第一个参数的函数。他是唯一的一个在所有的reducer函数中必须符合 (state, action) => newState
* slice reducer: 一个负责处理状态数中一块切片数据的函数，通常会作为combineReducers函数的参数(比如:区分module的各个reducer模块)
* case function: 一个负责处理特殊 action的更新逻辑的函数。可能就是一个reducer函数，也可能需要其他的参数才能正常工作
*  higher-order reducer： 一个以reducer函数作为参数，并且返回新的reducer函数的函数(比如： combineReducers, redux-undo)
