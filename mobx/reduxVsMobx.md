<!-- Redux 并不知道state 有没有发生变化，更不知道state具体哪些发生了变化。所以如果view层需要知道哪一部分需要更新，只能通过脏检查。通过使用带有记忆功能的selector(reselect)函数对性能有非常大的帮助。
 -->

1. Redux & Mobx
- 状态管理库
- 通过函数状态来来描述UI
- 和react没有直接关联
- 在react上运转的特别好

2. redux VS Mobx

- 
| redux | redux |
|----|----|
|sigle store|multi store|
|plain Objects|Observable data|
|Immutable|Mutable|
|Mormalized state|Nested state|

- 
| redux | redux |
|----|----|
|Manualy track updates|Aotomatically track updates|
|Explicit(明确的)|Implicit(非明确的)|
|Passive(被动的)|Reactive(响应式的)|


- 
* redux: Read-only state(pure)
(preState, action) => newState

* Mobx: Read an write to state(impure)
state => state

- 
* redux:
"smart" Vs "dumb" components
* mobx:
"smart" components only






