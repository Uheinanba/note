### 监听未来的action
一个简单的日志记录器
```
import { select, takeEvery } from 'redux-saga/effects';
function* watchAnlog() {
  yield takeEvery('*', function* logger(action) {
    const state = yield select();
    console.log('action', action);
    console.log('state after', state);
  });
}
```
使用take Effect实现上面相同的功能
```
function* watchAnlog() {
  while (true) {
    const action = yield take('*');
    const state = yield select();
    console.log('action', action);
    console.log('state after', state);
  }
}
```
- take 和之前的call和put。它创建另外一个命令对象，搞碎middleware等待一个待定的action。正如call Effect的情况中，middleware会暂停Generator,直到返回Promise被resolve。在take的情况中，它会暂停Generator知道匹配的action被发起了。 上面的例子中，watchAnlog处理暂停的状态，直到任意一个action被发起。

- 注意：我们运行了一个无限循环的 while(true)。这是一个 Generator函数。Generator。他不具备run-to-completion behavior。 Generator将在每次迭代上阻塞以等待action被发起。
- 在takeEvery情况中，被调用的任务无法控制何时被调用，它们将在每次action被匹配时一遍又一遍的被调用。并且无法控制何时停止监听。take情况恰恰相反，saga自己主动的拉去action。看起来像是在执行一个普通股的函数调用。

- 可以实现一些常规的push方法无法完成的控制流
用户完成三次SHOW_CONGRATULATION,显示一条祝贺信息(TODO_CREATED)
```
function* watchFirstThreeTodosCreation() {
  for(let i = 0; i < 3; i++) {
    const action = yield take('TODO_CREATED')
  }
  yield put({type: 'SHOW_CONGRATULATION'})
}
```
- 主动拉取的另外一个好处是我们可以使用熟悉的同步风格来描述我们的控制流。假设我们希望实现登录控制流LOGIN，LOGOUT。使用takeEvery我们要分别写两个任务一个用于LOGIN一个用于LOGOUT。这样逻辑就分开在两个地方了。比较难以阅读和理解。使用pull的模式，可以在同一地方写控制流
```
function* loginFlow() {
  while(true) {
    yield take('LOGIN');
    //...login logic
    yield take('LOGOUT');
    //...logout logic
  }
}
```

