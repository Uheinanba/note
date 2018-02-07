使用yield*为组合sagas提供了一种通畅的方式，但是这个方法也有一些局限性:
* 你可能会想要单独测试嵌套Generator。这导致一些重复测试代码及重复测试代码和重复执行的开销。我们不希望执行一个嵌套的Generator，而仅仅是想确认它是被传入正确的参数来调用
* 更重要的是, yield* 只允许任务的顺序组合，所以一次你只能yield* 一个Generator

```
function* mainSaga(getState) {
  const results = yield [call(task1), call(task2)];
  yield put(showResults(results));
}
```