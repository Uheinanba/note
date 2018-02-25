### 组件化
1. 组件分类
- 展示型组件 
数据进,Dom出,很直观
- 接入型组件(Container)
和数据层的service打交道，把数据传递给展示型的组件。
- 交互型组件
各类加强版的表单组件，强调复用。
- 功能型
<router-view>, <transition>本身不渲染任何东西，作为一种扩展，抽象机制存在。
2.  模版和jsx对比
jsx本质上是javascript,最大的优点就是灵活性。最大的价值在书写“功能型”组件，远超模版，但是模版在“纯展示型”组件更有优势。
3. 将相关的东西放在一起
js/html/css放在一个文件或者文件夹中
4. 声明式和命令式
5. FRP(响应式编程)
https://docs.google.com/presentation/d/1_BlJxudppfKmAtfbNIcqNwzrC5vLrR_h1e09apcpdNY/edit#slide=id.g19eebb1966_0_25

6. <div onClick="clickHandler"></div>被人诟病，为啥Vue的声明式写法受推崇。
* 因为onClick的是全局的，但是Vue组件摸板使用时有明确的作用域。
* js的逻辑和模版在一起的collection,所以不会造成困扰。

7. 变化检测
pull/push,
react属于pull,系统不知道数据什么时候变化了,需要显示(代码)告诉系统变化。
vue/rxjs属于push,在数据在变动时候,我们能够知道哪些数据的变动。

### 状态管理
本质:从事件源映射到状态的改变然后在映射到UI的变化。
声明式的渲染解决了从状态到UI的映射,状态管理的库实际上解决了如何管理事件源映射到状态的过程。

1. redux/mobx 
redux 强调纯函数, mobx 数据是响应式的(可变的)
但是都没有回答如何处理异步的情况. 简单的情况,不存在太复杂异步。
但是比较复杂的事件源(服务端推送,时时,多个异步的竞态)。
2. rxjs

3. 组件全局状态和局部状态如何区分

### 路由
URL到组件的映射.
web路由和app路由区别。web使用history, app使用的方式是层次覆盖的。

### css
- 和js完全解耦，靠预处理器BEM这样的规范来保持可以维护性
- css Modules,依然是Css，但是通过编译来避免css类名全局冲突
- css-in-js
- vue单文件组件css

BEM: 在组件化已经存在情况下，再维护一套模块结构。
css-in-js: 社区多种方案
https://medium.com/seek-blog/a-unified-styling-language-d0c208de2660

传统CSS问题
- 作用域
- Critical css, 渲染只需要的css文件。
- Atomic css, 原子性的css。
- 分发复用 可以发包到npm上复用
- 跨平台复用

### 部署

### 服务端数据的通信
1. restfull数据问题
 - 数据的大量关联性 (grapQL)
 - 时时同步的数据 rxjs(处理事件流)

2. 服务端的数据是否可以进行改变？
应该是immutable的