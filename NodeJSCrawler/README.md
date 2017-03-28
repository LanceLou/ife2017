# NodeJS爬虫整合任务

## 网页抓取分析服务系列之一（基础分析）
#### 任务目的

* 体会数据的封装
* 快速学习新工具的的能力
* 熟悉phantomjs的基础用法

#### 任务描述
* 安装phantomjs2.0，并查看webpage相关的API http://phantomjs.org/api/webpage/。
* 编写一个task.js脚本，参考官网的includeJs方法，实现根据传入的参数（关键字），抓取百度第一页对应该关键字的搜索结果。
* 将结果输出为json string回显。
* 回显的格式为

```js
{
   code: 1, //返回状态码，1为成功，0为失败
   msg: '抓取成功', //返回的信息
   word: '示例关键字', //抓取的关键字
   time: 2000, //任务的时间
   dataList:[   //抓取结果列表
       {
           title: 'xx',  //结果条目的标题
           info: ‘’, //摘要
           link: ‘’, //链接            
           pic: '' //缩略图地址
           }
   ]
}
```

#### 任务注意事项

* 多查API，学以致用
* 对于抓取的异常情况及时捕获并处理
* 结果中非自然结果的部分抛弃掉（广告、阿拉丁等），提前人工查看一下搜索结果，大多信息格式一致的都是自然结果，观察自然结果的class和相关结构特征。

#### 在线学习资料

* [phantomjs下载与安装](http://phantomjs.org/download.html)
* [phantomjs使用说明](http://phantomjs.org/quick-start.html)
* [更多API文档](http://phantomjs.org/api/webpage/)

## 网页抓取分析服务系列之二（设备模拟）

#### 任务目的

* 学会分析并借鉴其他工具的运行机制
* 学习更多phatomJS的配置

#### 任务描述
* 观察chrome开发者工具中device toolbar，切换到不同的device，查看浏览器BOM数据有何变化
把device toolbar中不同的device名对应的ua和尺寸信息记录下来，保存为配置文件
* 在任务1的基础上，增加一个参数，表示device信息，taskjs中，解析该参数并从配置文件找到对应的ua和尺寸，完成设置后再抓取
* 在结果中也增加一个device字段保存传入的设备名

#### 任务注意事项
* chrome device toolbar不了解可以百度一下看看使用方法，在console中打印对应BOM信息查看
抽取的配置文件选三个就好：iphone5、iphone6、ipad
* API提示：system.args、page.settings['userAgent']、page.viewportSize、page.clipRect

## 网页抓取分析服务系列之三（服务封装）

#### 任务目的
* 学习NodeJS HTTP模块
* 学习NodeJS和本地进程的互动
* 学习NodeJS和mongodb的交互

#### 任务描述
* 安装nodejs和mongodb
* 利用nodejs的HTTP模块封装一个node服务，监听8000端口，接受一个参数（关键字），http模块示例参考如下：

```js
var http = require("http");  
http.createServer(function(request, response) {  
       console.log('request received');  
       response.writeHead(200, {"Content-Type": "text/plain"});  
       response.write("Hello World");  
       response.end();  
}).listen(8000);  
console.log('server started');
```

* 收到请求后，启动phantomjs进程执行taskjs，并将接受到的参数传递给phantomjs
* phantomjs执行完后告诉node服务，并传回抓取的json结果
* node服务将结果存到mongodb中（使用mogoose）

#### 任务注意事项
* 参考nodejs和mongodb的相关文档快速学习和实践

#### 学习资料
* [nodejs安装](https://nodejs.org/en/download/)
* [nodejs 实现一个http server](http://jobar.iteye.com/blog/2083843)
* [nodejs http模块API](https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_http_createserver_requestlistener)
* [mongodb安装](https://www.mongodb.com/download-center?jmp=nav)
* [mongodb 介绍](http://www.runoob.com/mongodb/mongodb-tutorial.html)
* [mongoose](http://www.nodeclass.com/api/mongoose.html)


## 网页抓取分析服务系列之四（数据交互）
#### 任务目的
* 学习前后端的交互
* 学习静态文件服务器的实现
* 对于结果的二次处理

#### 任务描述
* 开发对应的前端界面，使用技术栈不限，越简单越好。输入包含一个输入框（输入关键字），一个下拉列表（选择对应的UL），一个提交按钮。
* 关键字输入做不能为空的校验，输入后发起异步请求，请求上阶段的服务。
* 在上阶段的服务中增加一个数据二次处理功能，对于返回的结果中有缩略图片的，下载图片到本地，并确保下载后的图片能被访问。
* 入库后，返回信息给前端，前端展示对应的抓取结果，以表格展示，图片加载本地已下载的图片

#### 任务注意事项
* 静态文件服务器需用nodejs实现，也是8080端口，可以使用现成框架（推荐使用koa2）
* 图片保存的路径需要注意生成唯一ID作为图片名，在数据库中需要存储该ID以便后续展现

#### 参考文档
[koa2](http://koa.bootcss.com/)


## 网页抓取分析服务系列之五（并发控制）

#### 任务目的

* 任务的并行控制逻辑设计
* socket.io的使用


#### 任务描述
* 在4的基础上前端增加一个输入选项（页码），表面需要抓取的页数，另外设备输入值由下拉框改为多选框。
* 单个用户可以选择多个设备的模拟任务，并且每个设备需要抓取多页。
* 服务器端根据选择的情况，生成任务待执行队列，每个phantomjs任务只执行一次抓取。同时允许nodejs调起最大5个phantomjs的进程。
* 前后端改为通过web socket通信，使用socket.io库，每完成一个抓取，将结果追加到页面中。同时在页面的最上方显示当前的进度（完成数/总任务数）。

#### 任务注意事项
* phantomjs进程的最大5个并发需要考虑多人同时提交和任务积压的情况：即两个用户A、B同时提交了4个任务到服务端，服务端只能执行A的4个、和B的1个，等前面有执行完毕的，B的剩下的再执行。

#### 参考资料
[socket.io参考](https://cnodejs.org/topic/50a1fcc7637ffa4155b5a264)
