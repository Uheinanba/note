### 回顾
1. ajax之后,前端就有了管理数据的需求了。ajax返回直接修改Dom。
问题：发起请求的事件源很多, 需要获取数据也很多。所以改进点是把所有的数据放在一起进行管理。
2. 前端MVC框架
backbone增加了前端路由,可以做前端的数据管理了。
和后端不一样，前端很多值是用于纪录状态的。对于后端来说状态变量可能是临时的。前端的状态比较重要。它决定了视图层，这些状态和业务关联,状态之间也相互关联。
3. UI = f(states)
数据的可视化，以前我们前端的任务是对html的可视化，现在我们前端的任务是对JSON的可视化。

4. mvvm
直接照搬后端数据的问题是要把业务数据在C层组装,这样不利于复用。在MVC这些不适合存放在数据库中读写也不具备表结构的状态是没有很好的被管理的。新方案:MV-VM。

5. 组件通信
父子组件: 不推荐双向数据绑定:难免子组件更改父组件的数据。
跨组件交互: 
- 通过祖先组件通信。
- eventBus
组件结构是树状结构的,eventBus是网状结构的。这样代码会很乱
- vuex/redux

- 回避了异步的问题
数据依赖于请求，如果请求也是依赖于请求的情况。