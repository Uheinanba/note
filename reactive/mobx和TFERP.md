Mobx 是一个TFRP的编程范式的实现

1. FRP
FRP的本质是，再声明一个值的时候，同时指定它的动态行为，这个值可能是事件，也可能是数据。
所以FRP有两个重要的分支
- 基于Event Stream的FRP
基于Event Stream的FRP擅长于管理Stream，可进行Join,split,merge,map等等。在需要处理多个Event Stream的时候非常有用，但是对于简单场景来说，就过于复杂来。比如Rxjs,Mostjs就是属于这类。
- Transparent FRP(TFRP)
Transparent FRP 实在背后实现Reactive Programming，和Event Stream的FRP一样，TFRP会在需要的时候更新View，不同的是TFRP不需要你定义如何(how)以及何时(when)更新，这类框架有Meter,EmberJs。

2. Mobx

Mobx和其他的实现有些不同
- 同步执行(这样监听的值始终是最新的，并且调试会方便，因为没有额外的Promise/Async库引入堆栈信息)
- 没有引入额外的数据结果，基于普通的Object,Class,Array的实现(学习成本更少，更新数据时更自然)
- 独立方案(不捆绑框架，相比Meter,EmberJs和Vuejs而言)

