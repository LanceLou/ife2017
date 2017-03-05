import {ElementClassNameUtil} from './utils.js'
/*
	文件不刷新上传
		输入: url, file
		输出: promise
	
	使用ajax无刷新上传给出文件(File/Blob)，返回promise对象。

	提供上传进度层()
 */


var containerDom = null, //容器
	progressWrapperCDom = null, //进度条包裹DOM
	forwardDom = null, //forward超按钮
	remenderDom = null,
	reOperateDom = null; //继续操作的按钮


/**
 * 显示上传进度，本版本暂未实现
 */
function showUploadProgressAnimate(){
	ElementClassNameUtil.removeClassName(containerDom, "UPC-uploadStateContainer-hidden");
	ElementClassNameUtil.addClassName(progressWrapperCDom, "showProgress");
}

function hiddenUploadDom(){
	ElementClassNameUtil.addClassName(containerDom, "UPC-uploadStateContainer-hidden");
	ElementClassNameUtil.removeClassName(progressWrapperCDom, "showUploadResult");
	ElementClassNameUtil.removeClassName(progressWrapperCDom, "showProgress");
}

/**
 * showUploadResult: 显示上传完成处理界面(即在此操作或进一步操作)
 * @param  {Boolean} isSuc 是否成功完成文件上传
 */
function showUploadResult(isSuc){
	//文件上传失败
	if (!isSuc) {
		remenderDom.innerHTML = "文件上传失败";
		reOperateDom.innerHTML = "返回";
	}else{
		remenderDom.innerHTML = "文件上传成功";
		reOperateDom.innerHTML = "继续操作";
	}
	ElementClassNameUtil.removeClassName(progressWrapperCDom, "showProgress");
	ElementClassNameUtil.addClassName(progressWrapperCDom, "showUploadResult");
}

/**
 * insertDom: 插入相关Dom，显示上传进度，上传结果等
 */
function insertDom() {
	var container = document.createElement("div");
	container.id = "UPC-uploadStateContainer";
	container.className = "UPC-uploadStateContainer-hidden";

	container.innerHTML = '<div class="mask"></div>'+
		'	<div class="stateProgress showProgress">'+
		'		<div class="progressWrapper">'+
		'			<i class="progressBar"></i>'+
		'		</div>'+
		'		<a href="javascript: void(0)" id="UPC-btn-reOperate">继续操作</a>'+
		'		<p id="UPC-remainder-p">上传成功</p>'+
		'	<a href="http://www.baidu.com" id="UPC-btn-forward">前往imgClipedList.com</a>'+
		'</div>';
	progressWrapperCDom = container.querySelector(".stateProgress");
	forwardDom = container.querySelector("#UPC-btn-forward");
	reOperateDom = container.querySelector("#UPC-btn-reOperate");
	remenderDom = container.querySelector("#UPC-remainder-p");

	reOperateDom.addEventListener("click", hiddenUploadDom);

	document.body.appendChild(container);
	containerDom = container;
}

/**
 * uploadFile: 文件上传处理模块，上传进度(*_*)，上传回调
 * @param  {Object}   data     Blob对象集合，{name: Blob}
 * @param  {String}   url      对应服务端处理Url
 * @param  {Function} callback 上传回调函数，直接传入request对象
 * @param  {Object}   options  选项参数{forwardName, forwardUrl, isProgress} forwardUrl: 操作完成(上传操作)跳转URL，forwardName: url链接标签显示文本，isProgress: 是否开启进度提示
 */
function uploadFile(data, url, callback, options) {
	if (typeof FormData === "undefined") 
		throw new Error("FormData is not implemented");
	if (!url || typeof callback !== "function") 
		throw new TypeError("params error: at least 3 params data: {name: Blob or it's subClass}, url: String url, callback: a function");
	var request = new XMLHttpRequest();
	request.open("POST", url);
	request.onreadystatechange = function () {
		if (request.readyState === 4 && callback) {
			callback(request, showUploadResult);
		}
	};

	//create the formDate and push data(multi files)
	var formdata = new FormData();
	for(var name in data){
		if (!data.hasOwnProperty(name)) continue;
		var value = data[name];

		if (typeof value === "function") continue;
		formdata.append("upload", value);
	}

	request.send(formdata);
	if (!containerDom) 
		insertDom();
	showUploadProgressAnimate();
}

export default uploadFile;