1. reducer 具备以下特性
 - (preState, action) => newState
 - 纯函数,不能突变(mutate,这点和vuex区别)。意味着总是返回一个新的更新后的对象。而不是去修改原始的state tree

2. 