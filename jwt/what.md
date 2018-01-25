https://github.com/smilingsun/blog/issues/1

### 起源
1. 传统的session认证
 http协议是一种无状态协议, 为了识别是哪个用户发出的请求。我们只能在服务器存储一份用户登录的信息。响应时候传递给浏览器.告诉浏览器保存cookie。以后每次请求都带上这个信息。
 缺点:
  1.1 难以扩展, 不同客户端用户增加, 独立服务器无法承载更多用户。(多个服务器的情况下, 共享session 需要存储在数据库中)
  1.2 session保存在内存中，随着认证用户的增加，服务端的开销明显增大。
  1.3 csrf, 基于cookie来进行用户识别,如果cookie被截获,用户很容易受到csrf攻击。

2. 基于token 的鉴权机制
 基于token 鉴权机制类似http协议也是无状态的, 它不需要在服务端去保留用户的认证信息或者会话信息。这就意味着基于token认证机制的应用不需要去考虑用户在那一台服务器登录了, 为应用的扩展提供了便利。

  2.1  jwt结构
  header : {
    typ:'JWT', // 声明类型
    alg:'HS265' // 声明加密算法
  }
  2.2 playload
  {
    标准的注册声明: {
      iss: jwt签发者(issuer)
      sub: jwt所面向的用户(subject)
      aud: 接收jwt的一方(audience)
      exp: jwt的过期时间,这个过期时间必须大于签发时间(expiration time)
      nbf: 定义在什么时间之前,该jwt都是不可用的
      iat: jwt签发时间
      jti: jwt的唯一身份标识，主要用来一次性的token,从而回避重放攻击
    },
    公共的声明: 可以添加任何信息, 一般添加用户相关信息或者其他业务需要的必要信息。但不建议添加敏感信息，因为该部分在客户端可以解密
    私有的声明: 私有声明是提供者和消费者所共有定义的声明, 一般不建议存放敏感信息。因为base64是对称解密的，意味着该部分信息可以归纳铭文信息
  }
  ```
  {
    'sub': '12234453',
    'name': 'john Doe',
    'admin': true
  }
  ```
  2.3 signature
  jwt的第三部分签证信息这个签证信息由三部分组成
  base64(header) + base64(playload) + secret
  ```
  const signature = HMACSHA256(
    base64UrlEncode(header) + '.' + base64UrlEncode(playload),
    'secret'
    ) // secret代表加盐。
  ```
3. jwt token信息如何保存
 3.1 在cookie中进行保存
