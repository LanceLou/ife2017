import fileOperate from './fileOperate.js'
import fileUpload from './fileUpload.js'
import ElementMouseMove from './mouseDownMove.js'
import ImgClipUtil from './imgClip.js'


var LanceImgClipNameSpace = LanceImgClipNameSpace || {};
LanceImgClipNameSpace.clipAndOperateAreaWrapper = document.querySelector("#lance-imgClip-operateArea");
LanceImgClipNameSpace.messageArea = LanceImgClipNameSpace.clipAndOperateAreaWrapper.querySelector(".remender");
LanceImgClipNameSpace.clipTargetImageContainer = LanceImgClipNameSpace.clipAndOperateAreaWrapper.querySelector("#lance-imgClip-srcImg");
LanceImgClipNameSpace.clipResultDom = null;
//剪切工具对象，处理剪切组件，DOM的事件响应，状态记录，回调函数调用等
LanceImgClipNameSpace.clipUtil = null;
//mouseMove对象，记录被剪切图片的移动并响应移动等
// LanceImgClipNameSpace.clipTargetMouseMove = null;
LanceImgClipNameSpace.clipUtilParamsInputDom = null;

LanceImgClipNameSpace.showClipResult = function(blob){
	var img = LanceImgClipNameSpace.clipResultDom;
	if (!img) {
		img = document.createElement("img");
		document.querySelector("#lance-imgClip-resultContainer").appendChild(img);
		LanceImgClipNameSpace.clipResultDom = img;
	}
	img.src = URL.createObjectURL(blob);
}


LanceImgClipNameSpace.insertClipTargetImg = function (file) {
	//考虑二次图片输入
	var operateAraeWrapper = LanceImgClipNameSpace.clipAndOperateAreaWrapper,
		image = new Image(),
		imgContainer = LanceImgClipNameSpace.clipTargetImageContainer,
		wrapperRect = imgContainer.parentNode.getBoundingClientRect();
	image.src = URL.createObjectURL(file[0]);
	image.onload = function (event) {
		console.log(image.width);
		imgContainer.style.width = image.width + "px";
		imgContainer.style.height = image.height + "px";
		imgContainer.style.left = (wrapperRect.width / 2) - (image.width / 2) + "px";
		imgContainer.style.top = (wrapperRect.height / 2) - (image.height / 2) + "px";

		imgContainer.style.backgroundImage = "url("+image.src+")";

		//直到有图片输入才初始化clip组件
		LanceImgClipNameSpace.clipUtil.setclipTaregtImage(imgContainer);
		LanceImgClipNameSpace.clipUtil.init();

		LanceImgClipNameSpace.messageArea.innerHTML = "图片输入成功！！！";
	}
};


LanceImgClipNameSpace.uploadFiles = function (blob) {
	//键: 当前时间戳加随机
	fileUpload({"name": blob}, "./upload", function (request, inCallback) {
		var responseText = request.responseText;
		console.log(responseText);
		inCallback(true);
	}, {forwardName: "前往imgClipedList.com", forwardUrl: "http://www.baidu.com", isProgress: true});
}

/**
 * 初始化相关函数监听
 */
LanceImgClipNameSpace.initEventLis = function () {
	var imgContainer = LanceImgClipNameSpace.clipTargetImageContainer,
		clipUtil = LanceImgClipNameSpace.clipUtil,
		clipUtilParamsInputDom = LanceImgClipNameSpace.clipUtilParamsInputDom,
		mouseMove = null;
	//文件输入事件监听
	fileOperate({dragTarget: document.querySelector("#lance-imgClip-drapInArea"), selectBtn: document.querySelector("#lance-imgClip-imgIn")},
		"png|jpg|gif|jpeg",LanceImgClipNameSpace.insertClipTargetImg, function (msg) {
			//文件输入错误处理
			LanceImgClipNameSpace.messageArea.innerHTML = msg;
		}
	);
	mouseMove = new ElementMouseMove(imgContainer.parentNode, imgContainer.previousElementSibling, imgContainer);
	mouseMove.addMoveListenerCallback(clipUtil.draw, clipUtil);

	LanceImgClipNameSpace.clipAndOperateAreaWrapper.addEventListener("click", function (event) {
		var target = event.target,
			paramWidth = 0,
			paramHeight = 0;
		
		if (target.tagName !== "A") return;

		if (target.id === "lance-imgClip-startClip") {
			LanceImgClipNameSpace.clipUtil.getTheCanvasBlob(LanceImgClipNameSpace.showClipResult);
		}
		if (target.id === "lance-imgClip-clipParamSet") {
			paramWidth = Number.parseInt(clipUtilParamsInputDom.width.value);
			paramHeight = Number.parseInt(clipUtilParamsInputDom.height.value);
			if (!paramWidth || !paramHeight || paramWidth < 60 || paramHeight < 60 || paramWidth > 2000 || paramHeight > 2000) {
				LanceImgClipNameSpace.messageArea.innerHTML = "非法的输入值或范围";
			}else{
				LanceImgClipNameSpace.messageArea.innerHTML = "";
				LanceImgClipNameSpace.clipUtil.updateClipParamAndDraw(paramWidth, paramHeight);
			}
		}
	});
	document.querySelector("#lance-imgClip-uploda-btn").addEventListener("click", function(event){
		LanceImgClipNameSpace.clipUtil.getTheCanvasBlob(LanceImgClipNameSpace.uploadFiles);
	});
}

/**
 * 初始化剪切上下文: 剪切工具宽度，位置，剪切区域参数初值，文件输入等
 */
LanceImgClipNameSpace.initClipContext = function(){
	//初始化剪切框:
	var clipUtilDom = LanceImgClipNameSpace.clipAndOperateAreaWrapper.querySelector(".clipUtil"),
		clipUtilWidth = 0,
		clipUtilHeight = 0,
		clipUtilLeft = 0,
		clipUtilTop = 0,
		clipUtilParamsInputDom = {},
		wrapperRect = clipUtilDom.parentNode.getBoundingClientRect(),
		wrapperWidth = wrapperRect.width,
		wrapperHeight = wrapperRect.height,
		clipUtil = null;
	clipUtilWidth = Number.parseInt(wrapperWidth * 2 / 5);
	clipUtilHeight = Number.parseInt(wrapperHeight / 2);
	clipUtilLeft = Number.parseInt((wrapperWidth / 2) - (clipUtilWidth / 2));
	clipUtilTop = Number.parseInt((wrapperHeight / 2) - (clipUtilHeight / 2));

	clipUtilDom.style.width = clipUtilWidth + "px";
	clipUtilDom.style.height = clipUtilHeight + "px";
	clipUtilDom.style.top = clipUtilTop + "px";
	clipUtilDom.style.left = clipUtilLeft + "px";

	clipUtilParamsInputDom.x = LanceImgClipNameSpace.clipAndOperateAreaWrapper;
	clipUtilParamsInputDom.y = clipUtilParamsInputDom.x.querySelector("#lance-imgClip-clip-y");
	clipUtilParamsInputDom.width = clipUtilParamsInputDom.x.querySelector("#lance-imgClip-clip-width");
	clipUtilParamsInputDom.height = clipUtilParamsInputDom.x.querySelector("#lance-imgClip-clip-height");
	clipUtilParamsInputDom.x = clipUtilParamsInputDom.x.querySelector("#lance-imgClip-clip-x");

	clipUtilParamsInputDom.x.value = clipUtilLeft;
	clipUtilParamsInputDom.y.value = clipUtilTop;
	clipUtilParamsInputDom.width.value = clipUtilWidth;
	clipUtilParamsInputDom.height.value = clipUtilHeight;

	clipUtil = new ImgClipUtil(clipUtilDom, clipUtilDom.parentNode, {width: clipUtilWidth, height: clipUtilHeight});
	clipUtil.addClipUtilAdjustListener(function (pos) {
		clipUtilParamsInputDom.x.value = pos.left;
		clipUtilParamsInputDom.y.value = pos.top;
		clipUtilParamsInputDom.width.value = pos.width;
		clipUtilParamsInputDom.height.value = pos.height;
	}, null);
	LanceImgClipNameSpace.clipUtilParamsInputDom = clipUtilParamsInputDom;
	LanceImgClipNameSpace.clipUtil = clipUtil;
}


function main(){
	//初始化剪切参数
	LanceImgClipNameSpace.initClipContext();
	LanceImgClipNameSpace.initEventLis();
}


main();

