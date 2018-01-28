让不同的sub-reducer组合在一起是非常有用的，有一下几个方法可以尝试
1. 抽离工具函数
2. 提取case reducer。把switch case的特殊逻辑封装成对应的函数,这样逻辑会很清晰
```
  function appReducer(state = initialState, action) {
    switch(action.type) {
      case 'SET_VISIBILITY_FILTER' : return setVisibilityFilter(state, action);
      case 'ADD_TODO' : return addTodo(state, action);
      case 'TOGGLE_TODO' : return toggleTodo(state, action);
      case 'EDIT_TODO' : return editTodo(state, action);
      default : return state;
    }
  }
```
3. 按域(domain)拆分数据
使用combineReducer对数据进行合并。
4. 减少样板代码
很多人不喜欢switch/case的语法结构。可以通过策略模式等减少这些样板代码
