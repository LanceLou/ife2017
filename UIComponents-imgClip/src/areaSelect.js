//区域选择模块
/*
	输入: wrapper(外包裹层，边界){Node}， target(需要选择的源对象，如图片){Node}， dataDisplay(数据变化展示区域，需传入四个文本容器，组件将改变其value值)  wrapper的长宽不一定要大于target的长宽
	输出: 相对于target的位置，是用Object存储，x: 左上角的横坐标 y: 左上角的纵坐标 width: 选中区域宽度 height：选中区域高度
	

	暴露方法：
		1. 设置当前起始与长宽
		2. 获取当前起始于长宽
		3. 启动剪切功能
		4. 停止剪切功能
		
	
	事件监听: x, y, width, height变化是，调用传入回调函数，或者提供Promise回调
 */