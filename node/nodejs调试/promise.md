### 可取消的Promise
1. 实现:利用race和reject实现promise取消?
```
function getWithCancel(promise, token) {
   return Promise.race([promise, new Promise((_, reject) => {
     token.cancel = function() {
       reject(new Error('cancel'))
     }
   })]).catch((e) => console.log(e))
};


var token = {};
var promise = fetch('https://api.github.com/users/heimanba')
getWithCancel(promise, token).then(res => console.log(res), err => console.log(err))
```


2. cancelation含义
canceled操作符代表是成功还是失败呢？
我的理解都不是，Canceld是第三种状态，就像fulfilled and rejected,它有点类似异常，但是并不代表失败，预期的是未处理的cancel而不是错误状态。


### 十道题理解promise 
1. 
```
const promise = new Promise((resolve, reject) => {
  console.log(1)
  resolve()
  console.log(2)
})
promise.then(() => {
  console.log(3)
})
console.log(4)
```
=> 1,2,4,3

2. 
```
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})
const promise2 = promise1.then(() => {
  throw new Error('error!!!')
})

console.log('promise1', promise1)
console.log('promise2', promise2)

setTimeout(() => {
  console.log('promise1', promise1)
  console.log('promise2', promise2)
}, 2000)
```
=> 
```
promise1 Promise { <pending> }
promise2 Promise { <pending> }
(node:50928) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): Error: error!!!
(node:50928) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
promise1 Promise { 'success' }
promise2 Promise {
  <rejected> Error: error!!!
    at promise.then (...)
    at <anonymous> }
```
promise有3中状态：pending,fulfilled或rejected，状态改变只能pending->fulfilled或者pending->rejected状态一旦改变久不能再变，上面promise2并不是promise1,而是一个新的Promise 实例。

3. 
```
const promise = new Promise((resolve, reject) => {
  resolve('success1')
  reject('error')
  resolve('success2')
})

promise
  .then((res) => {
    console.log('then: ', res)
  })
  .catch((err) => {
    console.log('catch: ', err)
  })
```
=> then: success1

4. 
```
Promise.resolve(1)
  .then((res) => {
    console.log(res)
    return 2
  })
  .catch((err) => {
    console.log(err)
    return 3
  })
  .then((res) => {
    console.log(res)
  })
```
=> 1,2
Promise可以链式调用，提起链式调用我们通常通过return this实现，不过Promise并不是这样实现的。Promise每次调用.then或者.catch都会返回一个新的promise，从而实现了链式调用