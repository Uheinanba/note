// https://tech.youzan.com/mobx_vs_redux/
// https://segmentfault.com/a/1190000010084073#articleHeader5

### 理念和概况
MST是一个状态容器，它将可变数据的简单性和易用性与不可变数据的可追踪性以及可观察数据的反应性和性能相结合。

简而言之，MST视图将不可变性(事务性，可追溯性和组合性)和可变性(可发现性，协同定位和封装)的最佳特征结合到状态管理。
所有事物都可以提供最好的开发者体验。与Mobx本身不同，MST非常关系如何构建和更新数据。这使得开箱即可解决非常常见的问题。

MST中心是活树的概念，树由可变但严格保护的对象组成，其中充满了运行时类型信息。换一种说法，每颗树都有一个形状(类型信息)和状态(数据)。从这颗有生命的树中，自动生成不可变的，结构上共享的快照。

```
import { types, onSnapshot } from 'mobx-state-tree';
const Todo = types.model('Todo', {
  title: types.string,
  done: false
}).actions(self => ({
  toggle() {
    self.done = !self.done;
  }
}));

const Store = types.model('Store', {
  todos: types.array(Todo)
});

const store = Store.create({todos: [{
  title: 'Get coffee'
}]})

onSnapshot(store, snapshot => {
  console.dir(snapshot)
})
store.todos[0].toggle();
```
通过使用可用的类型信息，可以毫不费力的将快照转换为活树，反之亦然。因此，开箱即可支持时间旅行，并且享HMR这样的工具对于支持示例而言是微不足道的。