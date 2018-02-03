### 基本使用
```
// saga.js文件
export function* incrementAsync() {
  yield delay(1000)
  yield put({ type: 'INCREMENT' })
}

// Our watcher Saga: 在每个 INCREMENT_ASYNC action 调用后，派生一个新的 incrementAsync 任务
export function* rootSagas() {
  yield* takeEvery('INCREMENT_ASYNC', incrementAsync)
}

// index.js 

import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { rootSagas } from './counter/saga';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(counter, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSagas);
```
* sagas被实现为Generator函数，它yield对象到redux-saga middleware。被yield的对象都是一类指令，指令可被middleware解释执行。当middleware取得一个yield后的promise，middleware会暂停saga,直到promise完成。
* 一旦promise被resolve，middleware会恢复saga去执行下一个语句(更准确的说是执行下面所有的语句，直到下一个yield).
* put就是我们所说的一个调用Effect的例子，Effect是一些简单的javascript对象，对象包含了要被middleware执行的指令。当middleware拿到一个被Saga yield后的Effect,它会暂停Saga，直到Effect执行完成，然后Saga再次恢复。

### 使用saga辅助函数
redux-sag提供了一些辅助函数，用来在一些特定的action被发起到Store时派生任务，这些辅助函数构建在低阶API之上。

- takeEvery 它提供了类似redux-thunk的行为
```
export function* fetchData(action) {
  try {
    const data = yield call(fetch, 'https://cnodejs.org/api/v1/topics');
    yield put({ type: 'FETCH_SUCCEEDED', data });
  } catch (error) {
    yield put({ type: 'FETCH_FAILED', error });
  }
}

function* watchFetchData() {
  yield* takeEvery('FETCH_REQUESTED', fetchData)
}
```
- 上面的例子中,takeEvery允许多个fetchData实例同时启动。在某个特定的时刻，我们可以启动一个新的fetchData任务。尽管之前还有一个或者多个fetchData尚未结束。
如果我们只想得到最新的那个请求的响应, 我们可以使用takeLstest辅助函数。
```
function* watchFetchData() {
  yield* takeLatest('FETCH_REQUESTED', fetchData)
}
```
和takeEvery不同，在任何时刻takeLatest只允许执行一个fetchData任务。并且这个任务是最后被启动的那个。如果之前有一个任务在执行，那之前的这个任务辉自动的被取消。

### 声明式 Effects
在redux-saga世界中，sagas都是Generator函数实现。我们从Generator里yield纯Javascript对象以表单saga逻辑，称为Effect。Effct是一个简单的对象，这个对象包含了有一些给middleware解释执行的信息。可以把Effect看作是发给middleware的指令以执行某些操作(调用异步函数，发起一个action到store)
- 使用Call函数, 替换Promise异步调用。
```
function* fetchProducts() {
  const products = Api.ftech('/products');
}
=>
function* fetchProducts() {
  const products = yield call(Api.ftech, '/products');
}
```
这样不需要测试返回结果，只需要测试发出执行了Promise的异步请求即可。
note: 
applay 和Call类似只是参数调用方式区别。
cps方法用来处理Node风格的函数。

### 发起action到store
为了方便测试，需要同样声明式的解决方案。put函数
```
function* fetchProducts(dispatch) {
  const products = yield call(Api.ftech, '/products');
  dispatch({type:'PRODUCTS_RECIVIED', products})
}
=>
function* fetchProducts() {
  const products = yield call(Api.ftech, '/products');
  yield put({type:'PRODUCTS_RECIVIED', products})
}
```

### 错误处理
使用try/catch进行错误处理

### 一个常见的抽象概念: Effect
- 概括来说，从saga内触发异步操作(Side Effect)总是由yield一些声明式的Effect来完成(也可以直接yield Promise，但会让测试更加困难)
- 一个Saga所做的实际上是组合那些所有的Effect，共同实现所需的控制流。最简单的是只需把yield 一个接一个的放置，就可以对yield过的Effect进行排序。也可以使用熟悉的控制流操作符(if, while, for)来实现更加复杂的控制流。
- 使用Effect诸如: call,put和高阶API如takeEvery组合，让我们实现和redux-thunk同样东西，但是又有额外的易于测试的好处。