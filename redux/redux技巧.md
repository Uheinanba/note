// https://loveky.github.io/2017/07/21/translate-five-tips-for-working-with-redux-in-large-applications/?utm_source=tuicool&utm_medium=referral
1. 使用索引保存数据，使用选择器读取数据
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

2. 区分标准状态|视图状态|编辑状态
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