- 有时候我们同事启动多个任务，但是又不想等待所有的任务完成，只是希望拿到胜利者。
下面演示了触发一个远程的获取请求，并且限制了1s内部的响应，否则超时处理
```
import { race, take, put } from 'redux-saga/effects'
function* fetchPostWithTimeout() {
  const {posts, timeout} = yield race({
    posts: call(fetch, '/posts'),
    timeout: call(delay, 1000),
  })
  if(posts) 
    put({type: 'POSTS_RECEIVED', posts})
  else
    put({type: 'TIMEOUT_ERROR'})
}
``` 
-  race的另外一个作用是： 它会自动的取消那些失败的Effects。假设有2个按钮
* 第一个用于在后台启动一个任务，这个任务在while(true)无限循环中。(例如:每X秒从服务器同步一些数据)
* 一旦该后台任务启动了，我们启动第二个按钮，这个按钮用于取消该任务
```
import { race, take, put } from 'redux-saga/effects'
function* backgroundTask() {
  while(true){}
}
function* watchStatrBgTask() {
  while(true) {
    yield take('START_BACKGROUND_TASK')
    yield race({
      task: call(backgroundTask),
      cancel: take('CANCEL_TASK')
    })
  }
}
```
在CANCEL_TASK的action被发起情况下，race Effect将自动取消backgroundTask,并在backgroundTask中抛出错误。