### 特点
1. reselect可以计算衍生数据，让redux 做到存储尽可能少的state
2. reselect比较高效，只有在某个参数变化的时候才发生计算过程
3. reselect是可以组合的他们可以作为输入，传递到其他的selector

### 创建一个selector
```
import { createSelector } from 'reselect'

const getVisibilityFilter = (state) => state.visibilityFilter
const getTodos = (state) => state.todos

export const getVisibleTodos = createSelector(
  [ getVisibilityFilter, getTodos ],
  (visibilityFilter, todos) => {
    switch (visibilityFilter) {
      case 'SHOW_ALL':
        return todos
      case 'SHOW_COMPLETED':
        return todos.filter(t => t.completed)
      case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed)
    }
  }
)
```
使用
```
  const mapStateToProps = state => ({
    todos: getVisibleTodos(state),
  });
```