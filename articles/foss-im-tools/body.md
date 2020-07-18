## Jami

特点是无需服务器，跟磁力链接一样难以封杀，坏处是收不到不在线时的群组消息，一个帐号不能同时登陆多设备，长期在线手机电量耗的快。  
无服务器另一款比较有名的聊天软件是 tox，不过 tox 的 android 和 ios 版本都几年没更新了，
推荐几乎一样模式的开源工具：<a href="https://jami.net">jami.net</a>, 它是 GNU 旗下的，老名字是 GNU Ring, 用户体验貌似好很多，我安装注册下来很简单。  
tox 的 DHT 走的是洋葱路由，我觉得有点多余，越繁琐越易失败。而 jami 是自己开发的一个简单通用的 OpenDHT 库，觉得还不错。（DHT 是 Distributed Hash Table，跟磁力链接相同原理。）  

手机扫码加我好友：  
<img src="jami.jpg" style="max-width:320px;">


## Matrix

另外，目前还有一个类似 email 分布式的开源聊天工具：<a href="https://matrix.org">matrix.org</a>, 可以用免费服务、线上付费服务（可以绑定私有域名），也可以自己在家搭建。  
跟 XMPP 类似，不过 XMPP 不争气，真正好用的客户端很少，而且除文字图片之外的高级功能相互兼容不好。  
matrix 目前基于 json + http (restful)，支持 **群组端到端加密**。自建服务器也很简单。（我是自建的，ID: `@d:d-l.io`）  
android, ios 和 浏览器 都用叫做 Element 的软件（也存在其他客户端）。线上试用 <a href="https://element.io/">element.io</a>, <a href="https://matrixim.cc">matrixim.cc</a> 等等（我找的这两个不`富强`可能比较慢。）  
matrix 的协议转换插件也比较全，可以跟别家的 IRC XMPP Email 等等互通。  
matrix 目前比较火，有机会取代商业闭源软件，希望不要跟当年 xmpp 一样。  
  
Matrix 推广步骤：
 - 非常合适企业内部使用，跟用企业 email 一样，数据可控；
 - 个人用户，技术人员带头先用起来，只要先增加高频联络人即可；
 - 普通用户使用也不复杂，手机安装 Element app，注册默认服务商的帐号即可。

最后想说，Jami 和 Matrix 互补配合使用很不错。
