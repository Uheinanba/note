### 按照数据的维度
按照数据维度的model设计原则就是抽离数据本身以及相关的操作方法
```
// models/user.js
export default {
    namespace: 'users',
    state: {
        list: [],
        total: null
    }
}
```
这个和我们常写的后台接口非常类似，只是关心数据本身，至于在使用users model的组件中遇到的状态管理等信息和model无关，而是作为组件本身的state维护
这种设计是的model非常纯粹，但是前端 数据和业务交互比较紧密，将状态放在model里面维护会使得我们的代码更加清晰可控。

### 业务维度
按照业务维度的model设计，则是将数据以及使用的强关联数据的组件中的状态统一抽象成model的方法。user/model设计如下
```
// models/users.js

export default {
  namespace: 'users',

  state: {
    list: [],
	total: null, 
    loading: false, // 控制加载状态
    current: null, // 当前分页信息
    currentItem: {}, // 当前操作的用户对象
    modalVisible: false, // 弹出窗的显示状态
    modalType: 'create', // 弹出窗的类型（添加用户，编辑用户）
  }
}
```
