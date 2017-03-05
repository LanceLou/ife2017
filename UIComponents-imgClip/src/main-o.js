/*! This file is created by lancelou */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _fileOperate = __webpack_require__(1);

	var _fileOperate2 = _interopRequireDefault(_fileOperate);

	var _fileUpload = __webpack_require__(3);

	var _fileUpload2 = _interopRequireDefault(_fileUpload);

	var _mouseDownMove = __webpack_require__(4);

	var _mouseDownMove2 = _interopRequireDefault(_mouseDownMove);

	var _imgClip = __webpack_require__(5);

	var _imgClip2 = _interopRequireDefault(_imgClip);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// /*
	// 	文件读取 -》 剪切  -》  生成  -》  上传

	// 	文件读取:
	// 		拖拽或者input输入 -》 将图片输入一个img标签中

	// 	事件驱动(监听):  

	//  */

	// var clipAndOperateAreaWrapper = document.querySelector("#lance-imgClip-operateArea");

	// function initEventLis(clipUtil) {
	// 	var clipBtn = document.querySelector("#lance-imgClip-startClip"),
	// 		imgDom = null;
	// 	clipBtn.addEventListener("click", function (event) {
	// 		clipUtil.getTheCanvasBlob(function (blob) {
	// 			if (!imgDom) {
	// 				imgDom = document.createElement("img");
	// 				document.querySelector("#lance-imgClip-resultContainer").appendChild(imgDom);
	// 			}
	// 			imgDom.src = URL.createObjectURL(blob);
	// 		});
	// 	});
	// }

	// function initClipContext() {
	// 	var srcImg = document.querySelector("#lance-imgClip-srcImg"),
	// 		clipUtilDom = document.querySelector(".clipUtil");
	// 	clipUtilDom.style.left = "260px";
	// 	clipUtilDom.style.top = "120px";
	// 	srcImg.style.backgroundImage = "url(/src/imgs/test.png)";
	// 	var mouseMove = new ElementMouseMove(document.querySelector("#lance-imgClip-oriImgWrapper"), srcImg.previousElementSibling, srcImg);
	// 	// console.log(ImgClipUtil);

	// 	var clipUtil = new ImgClipUtil(clipUtilDom, srcImg, srcImg.parentNode);
	// 	mouseMove.addMoveListenerCallback(clipUtil.draw, clipUtil);

	// 	initEventLis(clipUtil);
	// }

	// function addImage(file) {

	// }

	// function initFileIn() {

	// 	fileOperate({dragTarget: document.querySelector("#lance-imgClip-operateArea"), selectBtn: document.querySelector("#lance-imgClip-imgIn")},
	// 		"png|jpg|gif|jpeg",addImage, function (msg) {

	// 		}
	// 		);

	// }

	// function main(){
	// 	initFileIn();
	// 	initClipContext();
	// }

	// main();


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

	LanceImgClipNameSpace.showClipResult = function (blob) {
		var img = LanceImgClipNameSpace.clipResultDom;
		if (!img) {
			img = document.createElement("img");
			document.querySelector("#lance-imgClip-resultContainer").appendChild(img);
			LanceImgClipNameSpace.clipResultDom = img;
		}
		img.src = URL.createObjectURL(blob);
	};

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
			imgContainer.style.left = wrapperRect.width / 2 - image.width / 2 + "px";
			imgContainer.style.top = wrapperRect.height / 2 - image.height / 2 + "px";

			imgContainer.style.backgroundImage = "url(" + image.src + ")";

			//直到有图片输入才初始化clip组件
			LanceImgClipNameSpace.clipUtil.setclipTaregtImage(imgContainer);
			LanceImgClipNameSpace.clipUtil.init();

			LanceImgClipNameSpace.messageArea.innerHTML = "图片输入成功！！！";
		};
	};

	LanceImgClipNameSpace.uploadFiles = function (blob) {
		//键: 当前时间戳加随机
		(0, _fileUpload2.default)({ "name": blob }, "./upload", function (request, inCallback) {
			var responseText = request.responseText;
			console.log(responseText);
			inCallback(true);
		}, { forwardName: "前往imgClipedList.com", forwardUrl: "http://www.baidu.com", isProgress: true });
	};

	/**
	 * 初始化相关函数监听
	 */
	LanceImgClipNameSpace.initEventLis = function () {
		var imgContainer = LanceImgClipNameSpace.clipTargetImageContainer,
		    clipUtil = LanceImgClipNameSpace.clipUtil,
		    clipUtilParamsInputDom = LanceImgClipNameSpace.clipUtilParamsInputDom,
		    mouseMove = null;
		//文件输入事件监听
		(0, _fileOperate2.default)({ dragTarget: document.querySelector("#lance-imgClip-drapInArea"), selectBtn: document.querySelector("#lance-imgClip-imgIn") }, "png|jpg|gif|jpeg", LanceImgClipNameSpace.insertClipTargetImg, function (msg) {
			//文件输入错误处理
			LanceImgClipNameSpace.messageArea.innerHTML = msg;
		});
		mouseMove = new _mouseDownMove2.default(imgContainer.parentNode, imgContainer.previousElementSibling, imgContainer);
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
				} else {
					LanceImgClipNameSpace.messageArea.innerHTML = "";
					LanceImgClipNameSpace.clipUtil.updateClipParamAndDraw(paramWidth, paramHeight);
				}
			}
		});
		document.querySelector("#lance-imgClip-uploda-btn").addEventListener("click", function (event) {
			LanceImgClipNameSpace.clipUtil.getTheCanvasBlob(LanceImgClipNameSpace.uploadFiles);
		});
	};

	/**
	 * 初始化剪切上下文: 剪切工具宽度，位置，剪切区域参数初值，文件输入等
	 */
	LanceImgClipNameSpace.initClipContext = function () {
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
		clipUtilLeft = Number.parseInt(wrapperWidth / 2 - clipUtilWidth / 2);
		clipUtilTop = Number.parseInt(wrapperHeight / 2 - clipUtilHeight / 2);

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

		clipUtil = new _imgClip2.default(clipUtilDom, clipUtilDom.parentNode, { width: clipUtilWidth, height: clipUtilHeight });
		clipUtil.addClipUtilAdjustListener(function (pos) {
			clipUtilParamsInputDom.x.value = pos.left;
			clipUtilParamsInputDom.y.value = pos.top;
			clipUtilParamsInputDom.width.value = pos.width;
			clipUtilParamsInputDom.height.value = pos.height;
		}, null);
		LanceImgClipNameSpace.clipUtilParamsInputDom = clipUtilParamsInputDom;
		LanceImgClipNameSpace.clipUtil = clipUtil;
	};

	function main() {
		//初始化剪切参数
		LanceImgClipNameSpace.initClipContext();
		LanceImgClipNameSpace.initEventLis();
	}

	main();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _utils = __webpack_require__(2);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
		for (var i = 0; i < files.length; i++) {
			fileType = files[i].type;
			if (inParams.type.indexOf("|" + fileType.slice(fileType.lastIndexOf("/") + 1)) < 0) {
				files.splice(i, 1);
				i--;
			}
		}
	}

	function _initDragHandle(dragTarget) {
		dragTarget.addEventListener("dragenter", function (event) {
			return event.preventDefault();
		});
		dragTarget.addEventListener("dragover", function (event) {
			return event.preventDefault();
		});
		dragTarget.addEventListener("dragleave", function (event) {
			return event.preventDefault();
		});
		dragTarget.addEventListener("drop", function (event) {
			event.preventDefault();
			var dt = event.dataTransfer,
			    files = null;
			if (!dt) {
				inParams.errorCallback("浏览器不支持");
				return;
			}

			var files = [].concat(_toConsumableArray(dt.files));

			//未输入或输入的不是文件，DOM
			if (files.length === 0) {
				return;
			}

			_fileFilter(files);

			if (files.length === 0) {
				inParams.errorCallback("输入失败，请重新输入且输入符合要求的文件类型");
				return;
			}
			inParams.sucCallBack(files);
		});
	}

	function _initButtonInHandle(selectBtn) {
		if (!fileInput) fileInput = document.createElement("input");
		var input = fileInput;
		input.type = "file";
		input.style.display = "none";
		document.body.appendChild(input);
		selectBtn.addEventListener("click", function (event) {
			return input.click();
		});
		input.addEventListener("change", function (event) {
			var files = [].concat(_toConsumableArray(input.files));

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

		if (!_utils.TypeCheckUtil.isNode(dragTarget) && !_utils.TypeCheckUtil.isNode(selectBtn)) throw new TypeError("Params Error: firstParam(fileInDom) must have key dragTarget{Node} or selectBtn{Node} or both");

		if (_utils.TypeCheckUtil.isNode(dragTarget)) _initDragHandle(dragTarget);
		if (_utils.TypeCheckUtil.isNode(selectBtn)) _initButtonInHandle(selectBtn);
	}

	/**
	 * get the file from pc
	 * @param  {Object} fileInDom         文件输入DOM，容器或者输入按钮
	 * @param  {String} type              文件类型过滤，eg: "png|img"
	 * @param  {Function} sucCallBack 处理成功回调函数
	 * @param  {Function} errorCallback 处理错误回调函数
	 */
	function fileOperate(fileInDom, type, sucCallBack) {
		var errorCallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};

		if (!fileInDom || !_utils.TypeCheckUtil.isFunction(errorCallback) || !_utils.TypeCheckUtil.isFunction(sucCallBack)) throw new TypeError("Params Erroe: except 4 param, fileInDom{Object},type{String},sucCallBack{Function},errorCallback{Function}");
		inParams.fileInDom = fileInDom;
		inParams.type = "|" + type;
		inParams.sucCallBack = sucCallBack;
		inParams.errorCallback = errorCallback;
		_initFileIn();
	}

	exports.default = fileOperate;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var TypeCheckUtil = TypeCheckUtil || {
		isElement: function isElement(element) {
			return element instanceof Element;
		},
		isNode: function isNode(node) {
			return node instanceof Node;
		},
		isFunction: function isFunction(func) {
			return typeof func === "function";
		}
	};

	var ElementClassNameUtil = ElementClassNameUtil || {
		addClassName: function addClassName(element, className) {
			if (!TypeCheckUtil.isNode(element) || !className) throw new TypeError("params Error: except 2: element{Node}, className{String}");
			var oldClassName = element.className.trim();
			if (oldClassName.indexOf(className) >= 0) return false;
			className = oldClassName.length > 0 ? " " + className : className;
			element.className = oldClassName + className;
			return true;
		},
		removeClassName: function removeClassName(element, className) {
			if (!TypeCheckUtil.isNode(element) || !className) throw new TypeError("params Error: except 2: element{Node}, className{String}");
			var oldClassName = element.className.trim();
			if (oldClassName.indexOf(className) < 0) return false;
			element.className = oldClassName.replace(className, "");
			return true;
		},
		include: function include(element, className) {
			if (!TypeCheckUtil.isNode(element) || !className) throw new TypeError("params Error: except 2: element{Node}, className{String}");
			return element.className.indexOf(className) >= 0;
		}
	};

	exports.TypeCheckUtil = TypeCheckUtil;
	exports.ElementClassNameUtil = ElementClassNameUtil;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _utils = __webpack_require__(2);

	/*
		文件不刷新上传
			输入: url, file
			输出: promise
		
		使用ajax无刷新上传给出文件(File/Blob)，返回promise对象。

		提供上传进度层()
	 */

	var containerDom = null,
	    //容器
	progressWrapperCDom = null,
	    //进度条包裹DOM
	forwardDom = null,
	    //forward超按钮
	remenderDom = null,
	    reOperateDom = null; //继续操作的按钮


	/**
	 * 显示上传进度，本版本暂未实现
	 */
	function showUploadProgressAnimate() {
		_utils.ElementClassNameUtil.removeClassName(containerDom, "UPC-uploadStateContainer-hidden");
		_utils.ElementClassNameUtil.addClassName(progressWrapperCDom, "showProgress");
	}

	function hiddenUploadDom() {
		_utils.ElementClassNameUtil.addClassName(containerDom, "UPC-uploadStateContainer-hidden");
		_utils.ElementClassNameUtil.removeClassName(progressWrapperCDom, "showUploadResult");
		_utils.ElementClassNameUtil.removeClassName(progressWrapperCDom, "showProgress");
	}

	/**
	 * showUploadResult: 显示上传完成处理界面(即在此操作或进一步操作)
	 * @param  {Boolean} isSuc 是否成功完成文件上传
	 */
	function showUploadResult(isSuc) {
		//文件上传失败
		if (!isSuc) {
			remenderDom.innerHTML = "文件上传失败";
			reOperateDom.innerHTML = "返回";
		} else {
			remenderDom.innerHTML = "文件上传成功";
			reOperateDom.innerHTML = "继续操作";
		}
		_utils.ElementClassNameUtil.removeClassName(progressWrapperCDom, "showProgress");
		_utils.ElementClassNameUtil.addClassName(progressWrapperCDom, "showUploadResult");
	}

	/**
	 * insertDom: 插入相关Dom，显示上传进度，上传结果等
	 */
	function insertDom() {
		var container = document.createElement("div");
		container.id = "UPC-uploadStateContainer";
		container.className = "UPC-uploadStateContainer-hidden";

		container.innerHTML = '<div class="mask"></div>' + '	<div class="stateProgress showProgress">' + '		<div class="progressWrapper">' + '			<i class="progressBar"></i>' + '		</div>' + '		<a href="javascript: void(0)" id="UPC-btn-reOperate">继续操作</a>' + '		<p id="UPC-remainder-p">上传成功</p>' + '	<a href="http://www.baidu.com" id="UPC-btn-forward">前往imgClipedList.com</a>' + '</div>';
		progressWrapperCDom = container.querySelector(".stateProgress");
		forwardDom = container.querySelector("#UPC-btn-forward");
		reOperateDom = container.querySelector("#UPC-btn-reOperate");
		remenderDom = container.querySelector("#UPC-remainder-p");

		remenderDom.addEventListener("click", hiddenUploadDom);

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
		if (typeof FormData === "undefined") throw new Error("FormData is not implemented");
		if (!url || typeof callback !== "function") throw new TypeError("params error: at least 3 params data: {name: Blob or it's subClass}, url: String url, callback: a function");
		var request = new XMLHttpRequest();
		request.open("POST", url);
		request.onreadystatechange = function () {
			if (request.readyState === 4 && callback) {
				callback(request, showUploadResult);
			}
		};

		//create the formDate and push data(multi files)
		var formdata = new FormData();
		for (var name in data) {
			if (!data.hasOwnProperty(name)) continue;
			var value = data[name];

			if (typeof value === "function") continue;
			formdata.append("upload", value);
		}

		request.send(formdata);
		if (!containerDom) insertDom();
		showUploadProgressAnimate();
	}

	exports.default = uploadFile;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
		设置元素鼠标在其容器内拖动响应
			输入: 容器Wrapper(Element), 拖动目标mouseTarget(mouse作用目标), 移动目标moveTarget(在mouse作用下其position, 移动目标必须以其实际或者说完整大小出现，不要缩放)
			（注意: 其父容器的left， top， 当前被拖动的元素的左上角x与y(小于等于零)）
			
			输出: 通过暴漏函数(public func) 返回移动目标距离容器左上角的距离 为正值

			move事件的时候监听鼠标是否跑出有效区域
	 */

	/*
		鼠标是否按下 
	 */

	var _eventListenerInit = Symbol('eventListenerInit'),
	    _getMouseDeltaXY = Symbol('getMouseDeltaXY'),
	    _checkInMoveTarget = Symbol('checkInMoveTarget'),
	    _moveTheTarget = Symbol('moveTheTarget'),
	    _triggerMoveListener = Symbol('triggerMoveListener');

	var ElementMouseMove = function () {
		function ElementMouseMove(wrapper, mouseTarget, moveTarget) {
			_classCallCheck(this, ElementMouseMove);

			if (!_utils.TypeCheckUtil.isNode(wrapper) || !_utils.TypeCheckUtil.isNode(mouseTarget) || !_utils.TypeCheckUtil.isNode(moveTarget)) {
				throw new TypeError("param error: except 3 params and all param is Node or it's sub class");
			}
			this.wrapper = wrapper;
			this.mouseTarget = mouseTarget;
			this.moveTarget = moveTarget;

			//wrapper 属性 需要left，top  moveTarget的暂时不使用，因为这个rect是静态的
			this.wrapperRect = this.wrapper.getBoundingClientRect();

			//鼠标是否按下
			this.isMoveDown = false;

			//鼠标按下的位置，方便计算delta x 与 y
			this.mouseDownPoint = { x: 0, y: 0 };

			//moveTaregt移动的回调函数
			this.moveCallbackList = [];

			this[_eventListenerInit]();
		}

		/**
	  * getTopLeft: 返回moveTarget元素距离wrapper元素的左上角的距离(正值)
	  * @return {Object} the topLeft delta(Width)
	  */


		_createClass(ElementMouseMove, [{
			key: 'getTopLeft',
			value: function getTopLeft() {
				var moveTargetRect = this.moveTarget.getBoundingClientRect();
				return { x: moveTargetRect.left, y: moveTargetRect.top };
			}

			/**
	   * addMoveListenerCallback: 添加移动事件的监听回调函数
	   * @param {Function} callback 移动监听回调函数
	   * @param {Object}   context  回调函数执行上下文
	   */

		}, {
			key: 'addMoveListenerCallback',
			value: function addMoveListenerCallback(callback, context) {
				this.moveCallbackList.push({ callback: callback, context: context });
			}

			/**
	   * _triggerMoveListener: 触发所有当前movetarget对象移动的监听器，将当前movetarget相对于wrapper的左上角的位置传给回调{x: , y: }
	   *
	   */

		}, {
			key: _triggerMoveListener,
			value: function value(curPos) {
				console.log(curPos);
				this.moveCallbackList.map(function (item) {
					return item.callback.apply(item.context);
				});
			}
		}, {
			key: _checkInMoveTarget,
			value: function value(position) {
				var moveTargetRect = this.moveTarget.getBoundingClientRect();
				if (position.x < moveTargetRect.left || position.x > moveTargetRect.left + moveTargetRect.width || position.y < moveTargetRect.top || position.y > moveTargetRect.top + moveTargetRect.height) return false;
				return true;
			}

			/**
	   * _getMouseDeltaXY: 根据当前鼠标的位置计算鼠标自按下后移动的距离，可负值
	   * @return {Object} the detlaX and deltaY
	   */

		}, {
			key: _getMouseDeltaXY,
			value: function value(curPostion) {
				var moveTargetRect = this.moveTarget.getBoundingClientRect(),
				    delta = {};
				delta.x = curPostion.x - this.mouseDownPoint.x;
				delta.y = curPostion.y - this.mouseDownPoint.y;

				return delta;
			}
		}, {
			key: _moveTheTarget,
			value: function value(delta) {
				var rect = this.moveTarget.getBoundingClientRect();
				this.moveTarget.style.left = rect.left + delta.x + "px";
				this.moveTarget.style.top = rect.top + delta.y + "px";
			}

			/**
	   * _eventListenerInit: 初始化事件监听
	   */

		}, {
			key: _eventListenerInit,
			value: function value() {
				var self = this;
				this.mouseTarget.addEventListener("mousedown", function (event) {
					if (self[_checkInMoveTarget]({ x: event.clientX, y: event.clientY })) {
						self.isMoveDown = true;
						console.log("isTrue");
					}
					self.mouseDownPoint.x = event.clientX;
					self.mouseDownPoint.y = event.clientY;
				});

				//鼠标作用dom上的移动事件监听，注意是否跑出有效区域
				this.mouseTarget.addEventListener("mousemove", function (event) {
					if (!self[_checkInMoveTarget]({ x: event.clientX, y: event.clientY })) {
						//跑出有效区域
						return;
					}
					if (!self.isMoveDown) return;
					var delta = self[_getMouseDeltaXY]({ x: event.clientX, y: event.clientY });

					if (Math.abs(delta.x) <= 2 && Math.abs(delta.y) <= 2) return;
					// console.log(delta);
					self[_moveTheTarget](delta);

					self.mouseDownPoint.x = event.clientX;
					self.mouseDownPoint.y = event.clientY;

					self[_triggerMoveListener](self.getTopLeft());
				});

				//鼠标跑出mouseTarget区域，取消mousedowm
				this.mouseTarget.addEventListener("mouseout", function (event) {
					self.isMoveDown = false;
				});

				this.mouseTarget.addEventListener("mouseup", function (event) {
					self.isMoveDown = false;
				});
			}
		}]);

		return ElementMouseMove;
	}();

	exports.default = ElementMouseMove;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _initEventListener = Symbol('initEventListener'),
	    //实例方法
	_getClipUtilDramParams = Symbol('getClipUtilDramParams'),
	    _drawClipResult = Symbol('drawClipResult'),
	    _getOverlapArea = Symbol('getOverlapArea'),
	    _mouseDragMoveHandler = Symbol('mouseDragMoveHandler'),
	    _triggerAllClipUtilAdjustListener = Symbol('triggerAllClipUtilAdjustListener'),

	//实例属性
	_clipUtilRect = Symbol('clipUtilRect'),
	    _curDragDot = Symbol('curDragDot'),
	    //当前拖动缩放作用点(用于记录方向)
	_adjustListenerCallback = Symbol('adjustListenerCallback'),
	    _isInit = Symbol('isInit'),
	    _isMouseDown = Symbol('isDown');

	var ImgClipUtil = function () {
		/**
	  * 构造函数: 初始化剪切工具
	  * @param  {Element} clipUtil           剪切工具对象，暂时传入
	  * @param  {Element} clipTaregtWrapper 被剪切的图片的外部包裹Element，剪切工具的工作区域
	  * @param  {Object} canvasRect        指定画布的长宽，即clipUtil长宽
	  */
		function ImgClipUtil(clipUtil, clipTaregtWrapper, canvasRect) {
			_classCallCheck(this, ImgClipUtil);

			if (!_utils.TypeCheckUtil.isNode(clipUtil) || !_utils.TypeCheckUtil.isNode(clipTaregtWrapper)) {
				throw new TypeError("param error: except 3 params and all param is Node or it's sub class");
			}
			var canvas = null;
			this.clipUtil = clipUtil;
			this.clipTaregtWrapper = clipTaregtWrapper;
			this.clipTaregt = null;

			//如果画布环境不存在则创建一个
			canvas = clipUtil.querySelector("canvas");
			if (!canvas) {
				canvas = document.createElement("canvas");
				clipUtil.appendChild(canvas);
			}

			//设置画布的长宽，默认恒定
			canvas.width = canvasRect.width;
			canvas.height = canvasRect.height;

			this.canvas = canvas;
			this.canvasCtx = canvas.getContext('2d');

			//utilRect: 获取******画布******的rect对象
			this[_clipUtilRect] = canvas.getBoundingClientRect();

			this[_isMouseDown] = false;
			this[_isInit] = false;
			this[_adjustListenerCallback] = [];
		}

		_createClass(ImgClipUtil, [{
			key: 'setclipTaregtImage',
			value: function setclipTaregtImage(clipTaregt) {
				this.clipTaregt = clipTaregt;

				var imgSrc = "";
				//背剪切图片的Image对象
				this.clipTaregtImage = new Image();
				imgSrc = clipTaregt.style.backgroundImage;
				this.clipTaregtImage.src = imgSrc.slice(imgSrc.indexOf('\"') + 1, imgSrc.lastIndexOf('\"'));

				this.draw();
			}
		}, {
			key: 'init',
			value: function init(clipTaregt) {
				clipTaregt ? this.setclipTaregtImage(clipTaregt) : null;
				if (!this[_isInit]) {
					this[_initEventListener]();
					this[_isInit] = true;
				}
			}
		}, {
			key: 'draw',
			value: function draw(error) {
				var drawParams = this[_getClipUtilDramParams]();
				if (drawParams) {
					this[_drawClipResult](drawParams);
				} else {
					console.log("图片不在剪切区域！！！");
					error ? error("图片不在剪切区域！！！") : undefined;
				}
			}
		}, {
			key: 'updateClipParamAndDraw',
			value: function updateClipParamAndDraw(toWidth, toHeight, toTop, toLeft) {
				this.clipUtil.style.left = toLeft ? toLeft + "px" : undefined;
				this.clipUtil.style.top = toTop ? toTop + "px" : undefined;
				this.clipUtil.style.width = toWidth ? toWidth + "px" : undefined;
				this.clipUtil.style.height = toHeight ? toHeight + "px" : undefined;
				this.canvas.width = toWidth ? toWidth : undefined;
				this.canvas.height = toHeight ? toHeight : undefined;
				this[_clipUtilRect] = this.canvas.getBoundingClientRect();
				this.draw();
			}
		}, {
			key: 'addClipUtilAdjustListener',
			value: function addClipUtilAdjustListener(callback, context) {
				this[_adjustListenerCallback].push({ callback: callback, context: context });
			}

			/**
	   * 将canvas转化为Blob，用于剪切完成的图片预览，以便上传
	   * @param  {Function} callback 回调函数: 将传入的参数，canvas转化成的画布
	   */

		}, {
			key: 'getTheCanvasBlob',
			value: function getTheCanvasBlob(callback) {
				this.canvas.toBlob(callback);
			}
		}, {
			key: _mouseDragMoveHandler,
			value: function value(direction, startPos, endPos) {
				var toWidth = this.canvas.width,
				    toHeight = this.canvas.height,
				    toLeft = this.clipUtil.style.left,
				    toTop = this.clipUtil.style.top,
				    deltaX = endPos.x - startPos.x,
				    deltaY = endPos.y - startPos.y;
				toLeft = toLeft.slice(0, toLeft.lastIndexOf("px")) - 0;
				toTop = toTop.slice(0, toTop.lastIndexOf("px")) - 0;
				switch (direction) {
					case "lt":
						toWidth = toWidth - deltaX;
						toHeight = toHeight - deltaY;
						toLeft = toLeft + deltaX;
						toTop = toTop + deltaY;
						break;
					case "mt":
						toHeight = toHeight - deltaY;
						toTop = toTop + deltaY;
						break;
					case "rt":
						toWidth = toWidth + deltaX;
						toHeight = toHeight - deltaY;
						toTop = toTop + deltaY;
						break;
					case "lm":
						toWidth = toWidth - deltaX;
						toLeft = toLeft + deltaX;
						break;
					case "rm":
						toWidth = toWidth + deltaX;
						break;
					case "lb":
						toWidth = toWidth - deltaX;
						toHeight = toHeight + deltaY;
						toLeft = toLeft + deltaX;
						break;
					case "mb":
						toHeight = toHeight + deltaY;
						break;
					case "rb":
						toWidth = toWidth + deltaX;
						toHeight = toHeight + deltaY;
						break;
				}
				if (toWidth <= 60 || toHeight <= 60) return;
				this.updateClipParamAndDraw(toWidth, toHeight, toTop, toLeft);
				this[_triggerAllClipUtilAdjustListener]({ top: toTop, left: toLeft, width: toWidth, height: toHeight });
			}
		}, {
			key: _triggerAllClipUtilAdjustListener,
			value: function value(pos) {
				this[_adjustListenerCallback].map(function (item) {
					return item.callback.call(item.context, pos);
				});
			}
		}, {
			key: _initEventListener,
			value: function value() {
				var self = this,
				    dragStartPos = {};

				this.clipUtil.addEventListener("mousedown", function (event) {
					var target = event.target,
					    className = "";
					if (target.tagName !== "SPAN") return;
					className = target.className;
					self[_isMouseDown] = true;
					self[_curDragDot] = className.replace("dot ", "").trim();

					dragStartPos.x = event.clientX;
					dragStartPos.y = event.clientY;
					console.log(dragStartPos);
				});

				this.clipUtil.addEventListener("mouseup", function (event) {

					self[_isMouseDown] = false;
				});
				this.clipUtil.addEventListener("mouseleave", function (event) {
					console.log("leave");
					self[_isMouseDown] = false;
				});
				this.clipUtil.addEventListener("mousemove", function (event) {
					var target = event.target,
					    className = "";
					if (!self[_isMouseDown]) return;
					self[_mouseDragMoveHandler](self[_curDragDot], dragStartPos, { x: event.clientX, y: event.clientY });
					dragStartPos.x = event.clientX;
					dragStartPos.y = event.clientY;
				});
			}
		}, {
			key: _getClipUtilDramParams,
			value: function value() {
				var clipTaregtRect = this.clipTaregt.getBoundingClientRect(),
				    utilRect = this[_clipUtilRect],
				    deltaX = 0,
				    deltaY = 0,
				    pos = {}; /*pos: 剪切工具绘制参数: 画布其起始cx,cy 图片起始ix,iy 图片绘制宽度width, height*/

				// 图片不在剪接区域
				if (clipTaregtRect.left >= utilRect.right || clipTaregtRect.right <= utilRect.left) return false;
				if (clipTaregtRect.top >= utilRect.bottom || clipTaregtRect.bottom <= utilRect.top) return false;

				//-----------》》》》》》下面是图片与剪切区域有交集的情况

				//剪切区域包裹图片
				if (utilRect.top <= clipTaregtRect.top && utilRect.bottom >= clipTaregtRect.bottom && utilRect.left <= clipTaregtRect.left && utilRect.right >= clipTaregtRect.right) {
					return { cx: clipTaregtRect.left - utilRect.left, cy: clipTaregtRect.top - utilRect.top,
						ix: 0, iy: 0, width: clipTaregtRect.width, height: clipTaregtRect.height };
				}

				//图片包裹剪切区域
				if (clipTaregtRect.top <= utilRect.top && clipTaregtRect.bottom >= utilRect.bottom && clipTaregtRect.left <= utilRect.left && clipTaregtRect.right >= utilRect.right) {
					return { cx: 0, cy: 0, ix: utilRect.left - clipTaregtRect.left, iy: utilRect.top - clipTaregtRect.top, width: utilRect.width, height: utilRect.height };
				}

				//图片竖直穿过剪切区域
				if (clipTaregtRect.top <= utilRect.top && clipTaregtRect.bottom >= utilRect.bottom) {
					if (clipTaregtRect.left >= utilRect.left && clipTaregtRect.right <= utilRect.right) {
						//处在中间
						return { cx: clipTaregtRect.left - utilRect.left, cy: 0, ix: 0, iy: utilRect.top - clipTaregtRect.top, width: clipTaregtRect.width, height: utilRect.height };
					} else if (clipTaregtRect.left < utilRect.left) {
						//处在左边
						return { cx: 0, cy: 0, ix: utilRect.left - clipTaregtRect.left, iy: utilRect.top - clipTaregtRect.top, width: clipTaregtRect.right - utilRect.left, height: utilRect.height };
					} else {
						//处在右边
						return { cx: clipTaregtRect.left - utilRect.left, cy: 0, ix: 0, iy: utilRect.top - clipTaregtRect.top, width: utilRect.right - clipTaregtRect.left, height: utilRect.height };
					}
				}

				//图片水平穿过剪切区域
				if (clipTaregtRect.left <= utilRect.left && clipTaregtRect.right >= utilRect.right) {
					if (clipTaregtRect.top >= utilRect.top && clipTaregtRect.bottom <= utilRect.bottom) {
						//处在中间
						return { cx: 0, cy: clipTaregtRect.top - utilRect.top, ix: utilRect.left - clipTaregtRect.left, iy: 0, width: utilRect.width, height: clipTaregtRect.height };
					} else if (clipTaregtRect.top < utilRect.top) {
						//处在上边
						return { cx: 0, cy: 0, ix: utilRect.left - clipTaregtRect.left, iy: utilRect.top - clipTaregtRect.top, width: utilRect.width, height: clipTaregtRect.bottom - utilRect.top };
					} else {
						//处在下边
						return { cx: 0, cy: clipTaregtRect.top - utilRect.top, ix: utilRect.left - clipTaregtRect.left, iy: 0, width: utilRect.width, height: utilRect.bottom - clipTaregtRect.top };
					}
				}

				//左上
				if (clipTaregtRect.left < utilRect.left && clipTaregtRect.right > utilRect.left && clipTaregtRect.top < utilRect.top && clipTaregtRect.bottom > utilRect.top) {
					return { cx: 0, cy: 0, ix: utilRect.left - clipTaregtRect.left, iy: utilRect.top - clipTaregtRect.top, width: clipTaregtRect.right - utilRect.left, height: clipTaregtRect.bottom - utilRect.top };
				}

				//左下
				if (clipTaregtRect.left < utilRect.left && clipTaregtRect.right > utilRect.left && clipTaregtRect.top < utilRect.bottom && clipTaregtRect.bottom > utilRect.bottom) {
					return { cx: 0, cy: clipTaregtRect.top - utilRect.top, ix: utilRect.left - clipTaregtRect.left, iy: 0, width: clipTaregtRect.right - utilRect.left, height: utilRect.bottom - clipTaregtRect.top };
				}

				//右上
				if (clipTaregtRect.left < utilRect.right && clipTaregtRect.right > utilRect.right && clipTaregtRect.top < utilRect.top && clipTaregtRect.bottom > utilRect.top) {
					return { cx: clipTaregtRect.left - utilRect.left, cy: 0, ix: 0, iy: utilRect.top - clipTaregtRect.top, width: utilRect.right - clipTaregtRect.left, height: clipTaregtRect.bottom - utilRect.top };
				}

				//右下
				if (clipTaregtRect.left < utilRect.right && clipTaregtRect.right > utilRect.right && clipTaregtRect.top < utilRect.bottom && clipTaregtRect.bottom > utilRect.bottom) {
					return { cx: clipTaregtRect.left - utilRect.left, cy: clipTaregtRect.top - utilRect.top, ix: 0, iy: 0, width: utilRect.right - clipTaregtRect.left, height: utilRect.bottom - clipTaregtRect.top };
				}
			}
		}, {
			key: _drawClipResult,
			value: function value(_ref) {
				var cx = _ref.cx,
				    cy = _ref.cy,
				    ix = _ref.ix,
				    iy = _ref.iy,
				    width = _ref.width,
				    height = _ref.height;

				this.canvasCtx.save();
				this.canvasCtx.clearRect(0, 0, this[_clipUtilRect].width, this[_clipUtilRect].height);
				this.canvasCtx.drawImage(this.clipTaregtImage, ix, iy, width, height, cx, cy, width, height);
				this.canvasCtx.restore();
			}
		}]);

		return ImgClipUtil;
	}();

	exports.default = ImgClipUtil;

/***/ }
/******/ ]);