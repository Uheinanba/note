###基本使用
```
// saga.js文件
export function* helloSaga() {
  console.log('hello saga')
}
// index.js 

import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { rootSagas } from './counter/saga';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(counter, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSagas);
```
