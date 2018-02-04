### 描述

创建一个Effect,代表该任务是否已经被cancel了。通常情况下，可以在finally块中使用此效果来运行取消特定的代码
```
function* saga() {
  try {
    // ...
  } finally {
    if (yield cancelled()) {
      // logic that should execute only on Cancellation
    }
    // logic that should execute in all situations (e.g. closing a channel)
  }
}
```