###  mapStateToProps
  定义该参数，组件将辉监听Redux store的变化。任何时候，只要redux store变化，mapStateToProps函数就会被调用。该回调函数必须返回一个纯对象。这个对象会与组件的props 合并。如果省略这个参数，你的组件将不会监听Redux store。如果知道第二个参数ownProps，则该参数的值传递到组件的props,而且只要组件接收到新的props，mapStateToProps也会被调用。(例如，当props接收来自父组件的一个小小改动，那么你所使用的ownProps参数，mapStateToProps也会被重新计算)
  ```
  const mapStateToProps = state => ({
    todos: getVisibleTodos(state),
  });
  ```
  有些时候为了更好控制渲性能(配合reselect)用到的mapStateToProps需要返回一个函数。这个函数作为mapStateToProps()在独有组件实例中调用。这样允许你在每一个实例中去纪录。