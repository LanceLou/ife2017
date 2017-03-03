import {TypeCheckUtil} from './utils.js'


//文件操作模块(尝试返回一个promise对象)
/*
	
	输入: 文件输入DOM(可以是一个容器，或者是一个按钮，容器作为拖拽输入，按钮作为点击输入，两个都给就两个都监听){Object.dragTarget/selectBtn}, 文件类型限制{String}"type1|type2"，文件类型错误回调{Function}, 文件打开成功回调

	
	从传入的文件输入DOM触发文件输入，用户选择文件或拖入文件，类型错误，调用回调，打开错误或者浏览器不支持，reject。

 */

var inParams = {},
	fileInput = null;

function _fileFilter(files) {
	var fileType = "";
	//去掉不符合type的文件
	for(let i = 0; i < files.length; i++){
		fileType = files[i].type;
		if (inParams.type.indexOf("|" + fileType.slice(fileType.lastIndexOf("/") + 1)) < 0) {
			files.splice(i, 1);
			i--;
		}
	}
}

function _initDragHandle(dragTarget) {
	dragTarget.addEventListener("dragenter", event => event.preventDefault());
	dragTarget.addEventListener("dragover", event => event.preventDefault());
	dragTarget.addEventListener("dragleave", event => event.preventDefault());
	dragTarget.addEventListener("drop", function (event) {
		event.preventDefault();
		var dt = event.dataTransfer,
			files = null;
		if (!dt) {
			inParams.errorCallback("浏览器不支持");
			return;
		}
		var files = [...dt.files];

		_fileFilter(files);
		
		if (files.length === 0) {
			inParams.errorCallback("输入失败，请重新输入且输入符合要求的文件类型");
			return;
		}
		inParams.sucCallBack(files);
	});
}

function _initButtonInHandle(selectBtn) {
	if (!fileInput) 
		fileInput = document.createElement("input");
	var input = fileInput;
	input.type = "file";
	input.style.display = "hidden";
	document.body.appendChild(input);
	selectBtn.addEventListener("click", event => (input.click()));
	input.addEventListener("change", function (event) {
		var files = [...input.files];

		_fileFilter(files);

		if (files.length === 0) {
			inParams.errorCallback("输入失败，请重新输入且输入符合要求的文件类型");
			return;
		}
		inParams.sucCallBack(files);

	});
}

function _initFileIn() {
	var dragTarget = inParams.fileInDom.dragTarget,
		selectBtn = inParams.fileInDom.selectBtn;

	if (!TypeCheckUtil.isNode(dragTarget) && !TypeCheckUtil.isNode(selectBtn)) throw new TypeError("Params Error: firstParam(fileInDom) must have key dragTarget{Node} or selectBtn{Node} or both");

	if (TypeCheckUtil.isNode(dragTarget)) 
		_initDragHandle(dragTarget);
	if (TypeCheckUtil.isNode(selectBtn)) 
		_initButtonInHandle(selectBtn);
}


/**
 * get the file from pc
 * @param  {Object} fileInDom         文件输入DOM，容器或者输入按钮
 * @param  {String} type              文件类型过滤，eg: "png|img"
 * @param  {Function} sucCallBack 处理成功回调函数
 * @param  {Function} errorCallback 处理错误回调函数
 */
function fileOperate(fileInDom, type, sucCallBack, errorCallback = () => {}) {
	if (!fileInDom || !TypeCheckUtil.isFunction(errorCallback) || !TypeCheckUtil.isFunction(sucCallBack)) throw new TypeError("Params Erroe: except 4 param, fileInDom{Object},type{String},sucCallBack{Function},errorCallback{Function}");
	inParams.fileInDom = fileInDom;
	inParams.type = "|" + type;
	inParams.sucCallBack = sucCallBack;
	inParams.errorCallback = errorCallback;
	_initFileIn();
}

export default fileOperate;