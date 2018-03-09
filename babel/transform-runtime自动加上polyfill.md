### transform-runtime自动加上polyfill会自动的应用polyfill,即使没有使用babel-polyfill
// https://github.com/lmk123/blog/issues/45

目前浏览器对ES2015语法支持度不太好，所以当我们需要使用Promise,Set,Map等功能的时，就需要babel-polyfill提供

在转换ES2015语法为ECMAScript 5 的语法时，babel会需要一些辅助函数，比例_extend。babel默认会将这些辅助函数内联到每一个js文件中，这样文件多的时候，项目就会很大。

所以babel提供了transform-runtime来将这些辅助函数“搬”到一个单独的模块babel-runtime中,这样做能减少项目文件大小。

我们在写一个针对Chrome浏览器的项目的时候，已经使用了transform-runtime，但是没有用到babel-polyfill，因为很多ES2015的功能，Chrome都已经支持了。可是文件经过bable转换之后，文件大小增大很多, babel把promise的polyfill注入进来了。

babel-runtime中除了包含babel转换时需要用到的辅助函数之外，还包含了corejs和regenerator，而babel-polyfill也包含了这两个模块。

babel-runtime 可以做以下配置
```
{
    "plugins": [
        ["transform-runtime", {
            "polyfill": false,
            "regenerator": true
        ]
    ]
}
```
由此可见，我们在配置中直接使用 "plugins": ["transform-runtime"]时候，相当于引入了babel-polyfill



transform-runtime只能对语法进行解析, 如await,async等，但对Api不能够进行polyfill。
