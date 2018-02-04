### 描述 select(selector, ...args)
创建一条Effect描述信息，指示middleware调用提供的选择器获取Store上的数据(例如：返回selector(getState(), ...args)的结果)。
- selector: Function 一个 (state, ...args) => args函数，通过当前state和一些可选参数，返回当前Store state 上的部分数据
- args: Array (可选参数)，传递给选择器(附在getState后)
如果select参数为空(yield select())，则effect会取得整个state。
> 提示:在发起 Action到store时，middleware首先辉转发action到reducers燃火通知Sagas,意味着，当查询Store的state.获取的是action处理之后的state。