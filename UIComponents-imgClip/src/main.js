import fileOperate from './fileOperate.js'
import ElementMouseMove from './mouseDownMove.js'
import ImgClipUtil from './imgClip.js'

/*
	文件读取 -》 剪切  -》  生成  -》  上传
	
	文件读取:
		拖拽或者input输入 -》 将图片输入一个img标签中

	事件驱动(监听):  

 */


function initClipContext() {
	var srcImg = document.querySelector("#lance-imgClip-srcImg");
	srcImg.style.backgroundImage = "url(./imgs/test.png)";
	var mouseMove = new ElementMouseMove(document.querySelector("#lance-imgClip-oriImgWrapper"), srcImg.previousElementSibling, srcImg);
	// console.log(ImgClipUtil);
	var clipUtil = new ImgClipUtil(document.querySelector(".clipUtil"), srcImg, srcImg.parentNode);
	mouseMove.addMoveListenerCallback(clipUtil.draw, clipUtil);
}

function initFileIn() {
	fileOperate({dragTarget: document.querySelector("#lance-imgClip-operateArea"), selectBtn: document.querySelector("#lance-imgClip-imgIn")},
		"png|jpg|gif|jpeg",function (files) {console.log(files)}, function (msg) {console.log(msg);}
		);
}

function main(){
	initFileIn();
	initClipContext();
}

main();