// https://loveky.github.io/2017/07/21/translate-five-tips-for-working-with-redux-in-large-applications/?utm_source=tuicool&utm_medium=referral
### 使用索引保存数据，使用选择器读取数据
```
{
  "usersById": {
    123: {
      id: 123,
      name: "Jane Doe",
      email: "jdoe@example.com",
      phone: "555-555-5555",
      ...
    },
    ...
  }
}
```
如果需要查找特定用户，我们可以使用const user = state.usersById[userId]这种简单方式访问状态。这种方式不需要我们遍历整个列表，节省时间同时简化了代码。

同时这种模式增加了代码的可维护性。如果想改变状态结构，在不使用选择器的情况下，我们需要更新所有的视图代码以适应新的状态结构。为了避免这种情况，我们在视图中通过选择器读取状态。即使底层的状态结构发生变化，也只需要更新选择器，所有依赖状态的组件仍可以获取它们的数据，我们也不必更新它们。出于这样的原因，大型的redux 应用将受益与索引与选择器数据存储模式。

### 区分标准状态|视图状态|编辑状态
现实的redux 应用通常需要从一些服务(rest api)读取数据。在收到数据之后，我们发送一个包含收到数据的action,称为标准状态。
```
{
  "usersById": {
    123: {
      id: 123,
      name: "Jane Doe",
      email: "jdoe@example.com",
      phone: "555-555-5555",
      ...
    },
    ...
  }
}
```
假设我们界面允许编辑用户信息。当点击某个用户编辑图标时,我们需要更新状态，以便视图呈现出该用户的编辑条件。假设在users索引中存储数据对象上新增一个字段。而不是分开’存储视图状态‘和’标准状态‘。现在我们的状态如下。
```
{
 "usersById": {
    123: {
      id: 123,
      name: "Jane Doe",
      email: "jdoe@example.com",
      phone: "555-555-5555",
      ...
      isEditing: true,
    },
    ...
  }
}
```
假设点击提交按钮，修改以put形式提交回REST服务，服务返回了该用户最新的状态。如何将新的标准合并到Store呢？如果直接把新对象存储到user索引对应的id下。那么isEditing标记就会丢失。如果手动指定API的数据中哪些字段需要存储到store中。是的更新逻辑变得复杂。

我们把编辑状态分开进行存储
```
{
 "usersById": {
    123: {
      id: 123,
      name: "Jane Doe",
      email: "jdoe@example.com",
      phone: "555-555-5555",
      ...
    },
    ...
  },
  "editingUsersById": {
    123: {
      id: 123,
      name: "Jane Smith",
      email: "jsmith@example.com",
      phone: "555-555-5555",
    }
  }
}
```
同时拥有编辑状态和标准状态两个副本，点击取消后重置状态变得非常简单。只需要在试图中展示标准状态而不是编辑状态即可，不必再次调用REST API。我们任然在store中跟踪数据的编辑状态。如果确实需要保留这些更改，再次点击编辑按钮。之前状态再次展示出来。编辑状态和视图状态和标准状态区分开保存，既在代码组织和可维护性方面提供了更好的开发体验，又在表单操作方面提供了更好用户体验。

### 抽离case functiong 功能函数
```
const appreducer = (state = initState, action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return addTodo(state, action);
    case 'TOGGLE_TODO':
      return toggleTodo(state, action);
    default:
      return state;
  }
} 
```

###  如何解决slice reducer间共享数据的问题
slice reducer 本质上未来实现专门的数据专门管理，让数据管理更加清晰，那么slice reducer之间如何共享数据呢?
```
const crossReducer(state, sction) => {
  switch(action.type) {
    case UPDATE_COMMENTS:
      return (...state, {
        comments: commentsReducer(state.comments, action)
      })
    default:
      return state;
  }
}
const combineReducer = combineReducers({
  entities: entitiesreducer,
  articles: articlesReducer,
  papers: papersReducer
});

const rootReducer = (state, action) => {
  let tempstate = combinedReducer(state, action);
  let finalstate = crossReducer(tempstate, action);
  return finalstate;
}
```

当然可以使用reduce-reducers这个插件来简化上面的rootReducer
```
import reduceReducers from 'reduce-reducers';
export const rootReducer = reduceReducers(
  combineReducers({
    entities: entitiesreducer,
    articles: articlesReducer,
    papers: papersReducer
  }),
  scrossReducer
)
```
### 如何减少reducer的样板代码
通过redux-actions 来减少样板代码