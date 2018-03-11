1. 基本使用

```
// observable:被观察的对象
const appState = observable({
    counter: 0
});
appState.increment = function() {
    this.counter ++; 
}

// observer 观察者
@observer class Counter extends Component {
    render() {
        return (
            <div>
                Counter: {this.props.store.counter}<br/>
                <button onClick={this.handleInc}>+</button>
            </div>
        )
    }
    handleInc = () => {
        this.props.store.increment();
    }
}
```

2.  mobx-react-devtools
mobx-react-devtools 可以用于分析什么时候，为什么react 组件重新渲染，他提供三个特性。
* 可视化的显示组件何时渲染
* 显示组件的依赖关系树，以查看它呈现的数据依赖于哪些数据
* 详细记录哪些数据由你的操作更改，以及这些更改如何通过应用程序传播
```
import Devtools from 'mobx-react-devtools';
render() {
    return (
        <div>
            <Devtools />
        </div>
    )
}
```

3. 使用 mobx reactions 得到computed计算值, 并管理副作用。
计算值是可以从状态自动导出的值，并且可以使用reactions 来管理副作用，例如绘制用户界面。
```
const t = new class temperature {
    @observable unit = 'C';
    @observable tempersCelsius = 25;
    @computed get temperature() {
        return this.tempersCelsius + this.unit;
    }
}
```
或者
```
const t = observable({
    unit: 'C',
    tempersCelsius: 25,
    get temperature() {
        return this.tempersCelsius + this.unit;
    }
})
```

4. 使用可观察的object,array,map来存储数据
mobx支持的数据结构:

5. 使用mobx action来更改和保护状态
- 任何应用都有动作。动作是任何用来修改状态的东西。使用Mobx你可以在代码中显式的标记出动作所在的位置。action有利于更好的组织代码。
它接受一个函数并返回具有同样签名的函数，但是用transaction、untracked 和 allowStateChanges进行包裹。尤其是transaction的自动应用会产生巨大的性能收益，动作会分批处理变化只在(最外层)动作完成之后通知计算值进行反应。这将确保在动作完成之前，动作期间生成的中间值或未完成的值对应用的其余部分是不可见的。
action自动创建transaction，并将更改 分组放在一起。
使用 useStrict(true);强制使用action更改数据

```
const t = new class temperature {
    @observable unit = 'C';
    @observable tempersCelsius = 25;
    @computed get temperature() {
        return this.tempersCelsius + this.unit;
    }
    @action setUnit(newUnit) {
        this.unit = newUnit;
    }
}
```

- action可以被命名
```
const t = new class temperature {
    @observable unit = 'C';
    @observable tempersCelsius = 25;
    @computed get temperature() {
        return this.tempersCelsius + this.unit;
    }
    @action('update unit') // 更新unit
    setUnit(newUnit) {
        this.unit = newUnit;
    }
}
```

- Transaction是底层的API,大部分的场景下使用action或runInAction会是更好的选择。
transaction(worker: () => void)用来批量更新，在事物结束前不会通知任何观察者。transaction接受一个无参数的  worker函数并作为参数运行它。这个函数完成前不会通知任何观察者。transaction返回worker函数返回的任何值。
```
import {observable, transaction, autorun} from "mobx";

const numbers = observable([]);

autorun(() => console.log(numbers.length, "numbers!"));
// 输出: '0 numbers!'

transaction(() => {
    transaction(() => {
        numbers.push(1);
        numbers.push(2);
    });
    numbers.push(3);
});
// 输出: '3 numbers!'
```

6. 处理异步
- extendObservable
extendObservable 接收两个或者更多的参数，一个是 target 对象，一个或多个 properties 映射。 它会把 properties 映射中的所有键值对添加到 target 对象中作为 observable 属性并返回 target 对象。
observable.object(object)实际上是extendObservable({}, object)的别名。


7. 使用 Provider
```
import { Provider } from 'mobx-react';
const stores = {
    userStore,
};

ReactDOM.render(
    <Provider  {...stores}>
        <App />
    </Provider>,
    document.getElementById('root')
);
// 组件中使用时候

@inject('userStore')
@observer class App extends Component {
    render() {
        return (
            <div>
                demo
            </div>
        )
    }
}

```