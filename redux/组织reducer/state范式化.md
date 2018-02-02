### 概念
大部分的程序处理的数据都是嵌套或者相互关联的，例如一个博客中有多篇文章，每篇文章有多条评论，所有的文章和评论都是由用户产生。这种应用的数据如下:
```
const blogPosts = [
    {
        id : "post1",
        author : {username : "user1", name : "User 1"},
        body : "......",
        comments : [
            {
                id : "comment1",
                author : {username : "user2", name : "User 2"},
                comment : ".....",
            },
            {
                id : "comment2",
                author : {username : "user3", name : "User 3"},
                comment : ".....",
            }
        ]    
    },
    {
        id : "post2",
        author : {username : "user2", name : "User 2"},
        body : "......",
        comments : [
            {
                id : "comment3",
                author : {username : "user3", name : "User 3"},
                comment : ".....",
            },
            {
                id : "comment4",
                author : {username : "user1", name : "User 1"},
                comment : ".....",
            },
            {
                id : "comment5",
                author : {username : "user3", name : "User 3"},
                comment : ".....",
            }
        ]    
    }
    // and repeat many times
]
```
上面的数据结构比较复杂，并且有部分数据是重复的，还存在下面一些问题：
- 当数据在多处冗余后，需要更新时。很难保证所有的数据都进行更新
- 嵌套的数据意味着 reducer逻辑嵌套更多，复杂度更高。尤其在打算更新深层嵌套数据的时
- 不可变的数据在更新时需要状态树的祖先数据进行复制和更新，并且新的对象引用会导致与之connect的所有UI组件都重复render.尽管要显示的数据没有任何改变，对深层嵌套的数据对象进行更新也会强制完全无关的UI组件重复render。
正因为如此，在redux store中管理关系数据或嵌套数据的推荐做法是将一部分视为数据库，并且将数据按范式化进行存储。

###  设计范式化的state
范式化的数据包括几个概念
- 任何类型的数据在state中都有自己的'表'；
- 任何‘数据表’应将各个项目存储在对象中，其中每个项目的ID作为key项目本身作为value
- 任何对单个项目的引用都应该根据存储项目的ID来完成
- ID数据应用用于排序
上面博客实例state结构范式化的结果如下:
(适用于一对多，一对一的场景)
```
{
    posts : {
        byId : {
            "post1" : {
                id : "post1",
                author : "user1",
                body : "......",
                comments : ["comment1", "comment2"]    
            },
            "post2" : {
                id : "post2",
                author : "user2",
                body : "......",
                comments : ["comment3", "comment4", "comment5"]    
            }
        }
        allIds : ["post1", "post2"]
    },
    comments : {
        byId : {
            "comment1" : {
                id : "comment1",
                author : "user2",
                comment : ".....",
            },
            "comment2" : {
                id : "comment2",
                author : "user3",
                comment : ".....",
            },
            "comment3" : {
                id : "comment3",
                author : "user3",
                comment : ".....",
            },
            "comment4" : {
                id : "comment4",
                author : "user1",
                comment : ".....",
            },
            "comment5" : {
                id : "comment5",
                author : "user3",
                comment : ".....",
            },
        },
        allIds : ["comment1", "comment2", "comment3", "commment4", "comment5"]
    },
    users : {
        byId : {
            "user1" : {
                username : "user1",
                name : "User 1",
            }
            "user2" : {
                username : "user2",
                name : "User 2",
            }
            "user3" : {
                username : "user3",
                name : "User 3",
            }
        },
        allIds : ["user1", "user2", "user3"]
    }
}
```

- 如果将 redux视为数据库，在很多数据库设计时的规则在这里也是适用。例如:在多对多的关系中。可以设计一张中间表存储相关联系项目的ID(关联表，连接表)，为了一致性我们同时灰使用byId和allIds用于实际项目中。
```
{
    entities: {
        authors : { byId : {}, allIds : [] },
        books : { byId : {}, allIds : [] },
        authorBook : {
            byId : {
                1 : {
                    id : 1,
                    authorId : 5,
                    bookId : 22
                },
                2 : {
                    id : 2,
                    authorId : 5,
                    bookId : 15,
                }
                3 : {
                    id : 3,
                    authorId : 42,
                    bookId : 12
                }
            },
            allIds : [1, 2, 3]

        }
    }
}
```