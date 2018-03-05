### 数据流向
数据的改变发生通常是用户交互行为或者浏览器行为(路由跳转)等触发的，当此类行为会改变数据的时候可以通过dispatch 发起一个action,如果是同步行为则会通过 redcuers改变state,如果是异步的行为会先触发Effects然后流向Reducers最终改变state。

### State
state 表示 Model的状态数据，通常表现为一个js对象，操作时候每次都要当作不可变的数据来对待，保证每次都是全新的对象，没有引用关系，这样才能保证state的独立性，便于测试和追踪变化。
可以通过dva实例属性_store看到顶部的state数据
```
const app = dva();
console.log(app._tore);
```
### Action
action是一个普通的js对象，它是改变state的唯一途径。无论从UI，网络回调还是websocket等获取的数据，最终都会通过dispatch函数调用一个action,从而改变对应的数据。action必须带有type属性指明具体的行为。

### dispatch 函数
dispatch是一个用于触发action的函数，action 是改变state的唯一途径，但是它只是描述一个行为，而dispatch看作是触发这个行为的方式。reducer则是描述如何改变数据的。

### Subscription
Subscriptions是一种从源获取数据的方法。来自elm
Subscription语义是订阅，用于订阅一个数据源，然后根据条件dispatch需要的action。数据源可以是当前的时间，服务器的ws连接，keybord输入，路由变化等。
```
import key from 'keymaster';
app.model({
    namespace: 'count',
    subscriptions: {
        keyEvent(dispatch) {
            key('⌘+up, ctrl+up', () => { dispatch({type:'add'}) });
            },
        }
    }
})
```