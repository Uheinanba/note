### reducer的基本机构
整个应用只有一个单一的reducer函数，这个函数是传递给createStore的第一个参数，一个单一的reducer最终需要做以下几件事:
-  reducer第一次被调用的时候，state的值是 underfined。 reducer需要在action传递之前提供一个默认的state来处理这种情况
```
const counter = (state = 0, action) => {}
```
- reducer需要先前的state和dispatch的action来决定需要做什么事
- 假设需要更改数据，应该用更新后的数据创建新的对象或数组并返回它们。
- 如果没什么更改，返回当前state本身


### state的基本结构
redux鼓励根据要管理的数据来思考你的应用程序。数据就是你应用的state,state的结构和组织方式通常称为'shape'.在你组织reducer的逻辑时候，state的shape通常扮演重要的角色

- redux state中顶层的状态树通常是一个普通的js对象。在顶层对象中组织数据最常见的方式是划分子树，每个顶层的key对应着和特定域或者切片相关的数据。

- 大多数应用会处理多种数据，通常分为三类
  * 域数据(domain data): 应用需要展示，使用或者修改的数据(比如从服务器检索到的所有的todos)
  * 应用状态(App state): 特定于应用某个行为的数据(比如: todos请求中, 或者todos请求失败)
  * UI状态(UI state): 控制UI如何展示的数据(比如: 编写TODO模型的窗口现在是展开的)。
  store代表应用的核心，因此应用的域数据(Domain data)和应用状态数据(App state)定义一个state,而不是UI状态(UI state)。
  * 典型的 state如下
    ```
    {
      domain1: {},
      domain2: {},
      appState1: {},
      appState2: {}
    }
    ```