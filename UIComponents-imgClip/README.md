# UI组件之图片裁剪器(后文附带V1.0实现细节)

## [Demo地址](http://115.29.49.217:8889/)

## 任务描述

* 如下示例图中所示，参考并实现一个图片裁剪器：

![Demo](http://ww4.sinaimg.cn/large/ad5d774bjw1fd3liuup65j20ks0lqjw9.jpg)

* 可以通过“选择图片”按钮唤起本地图片选择对话框

* 选中图片后，出现图片裁剪框以及裁剪预览，裁剪框背景使用黑白格画布填充
* 提供2种裁剪图片的方式：(1)固定宽高度裁剪；(2)自由裁剪。2种裁剪方式可支持用户自由选择，固定宽高度裁剪时，可支持用户输入目标宽、高
* 将裁剪后的图片以请求方式发送给服务端，服务端生成最终图片，并将其保存在本地

## 任务注意事项

* 示例图仅为参考，样式及交互方式不需要完全实现一致

* 可以合理使用第三方框架、类库，但不可直接使用现成的图片裁剪组件
* 请注意代码风格的整齐、优雅
* 代码中含有必要的注释

## 实现

![achive](http://og4j2atko.bkt.clouddn.com/%E5%9B%BE%E5%BD%A2%E5%89%AA%E8%BE%91%E7%BB%84%E4%BB%B6%E5%BA%94%E7%94%A8.png)

上课吃饭睡觉加搞这个，也算是花了我四五天咯，首先声明，没做浏览器兼容，建议不要用***IE***测试！

后台使用nodejs，这方面哦还是个菜鸟，不多说。

说一下整个剪切方面的技术点:

主要还是canvas的绘图与图形图像处理功能，以及FormDate这种ajax模拟原生form的interface。

* 首先canvas事项图像剪切我觉得一个函数足矣: CanvasRenderingContext2D.drawImage()

ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

相关使用方法大家可以查下文档，其余的就是看你参数给得够不够好了。

* 然后就是canvas导出图片，这个好办:

HTMLCanvasElement.toBlob()

这个方法可以根据canvas的当前内容生成一个Blob对象，什么，你还不知道Blob是啥，文档走起。其实Blob对象在文件操作方面是非常常见的，咱们的File对象就是它的子类。

* 有了上面提到的Blob对象，咱们就可以"做"图片了

URL.createObjectURL()

creates a DOMString containing an URL representing the object given in parameter.

* 然后就是拖动图片输入，文件上传这些之类的常见的问题我就不多说了。

## 说一下不足

1. 文件上传进度事件暂未实现，nodejs的formidable有一个progress事件这个服务端没问题，客服端认证带个token这个也是可以的。现在的想法是客服端ajax轮询。各位有什么好的建议，实践欢迎讨论，期待您的建议。
2. 老生常谈，兼容性问题，canvas的话去找个polyfill应该差不多，其他ajax的formdata的话做个iframe装个表单提交？社区里面有说flash，这方面作者也不是特别擅长，还请各位多多指教。
3. 组件方面这一版涉及的不多，分工不够明确，可能还有许多的耦合。
4. 当然，可能还有一些bug，也欢迎各位讨论。

以上作者将独立出一个分支开发2.0版本，也期待各位的加入。

-- LanceLou 敬上

